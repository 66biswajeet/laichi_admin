import { useContext, useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";
import PageTitle from "@/components/Typography/PageTitle";
import { notifyError, notifySuccess } from "@/utils/toast";

const CustomProducts = () => {
  const { adminInfo } = useContext(SidebarContext);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featureEnabled, setFeatureEnabled] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [sizeRanges, setSizeRanges] = useState([]);
  const [editingShape, setEditingShape] = useState(null);
  const [editingSize, setEditingSize] = useState(null);
  const [newShapeName, setNewShapeName] = useState("");
  const [newSize, setNewSize] = useState({
    label: "",
    dimensions: "",
    basePrice: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await AdminServices.getCustomProductSettings();
      setSettings(response);
      setFeatureEnabled(response.featureEnabled);
      setShapes(response.shapes || []);
      setSizeRanges(response.sizeRanges || []);
      setLoading(false);
    } catch (error) {
      notifyError("Error loading settings");
      setLoading(false);
    }
  };

  const handleToggleFeature = async () => {
    try {
      await AdminServices.updateCustomProductSettings({
        featureEnabled: !featureEnabled,
        shapes,
        sizeRanges,
      });
      setFeatureEnabled(!featureEnabled);
      notifySuccess(
        `Custom sticker feature ${!featureEnabled ? "enabled" : "disabled"}`,
      );
    } catch (error) {
      notifyError("Error updating feature status");
    }
  };

  const handleAddShape = async () => {
    if (!newShapeName.trim()) {
      notifyError("Please enter a shape name");
      return;
    }

    try {
      const response = await AdminServices.addShape({ name: newShapeName });
      setShapes(response.settings.shapes);
      setNewShapeName("");
      notifySuccess("Shape added successfully");
    } catch (error) {
      notifyError("Error adding shape");
    }
  };

  const handleUpdateShape = async (shapeId, updates) => {
    try {
      const response = await AdminServices.updateShape(shapeId, updates);
      setShapes(response.settings.shapes);
      setEditingShape(null);
      notifySuccess("Shape updated successfully");
    } catch (error) {
      notifyError("Error updating shape");
    }
  };

  const handleDeleteShape = async (shapeId) => {
    if (!confirm("Are you sure you want to delete this shape?")) return;

    try {
      const response = await AdminServices.deleteShape(shapeId);
      setShapes(response.settings.shapes);
      notifySuccess("Shape deleted successfully");
    } catch (error) {
      notifyError("Error deleting shape");
    }
  };

  const handleAddSizeRange = async () => {
    if (
      !newSize.label.trim() ||
      !newSize.dimensions.trim() ||
      !newSize.basePrice
    ) {
      notifyError("Please fill all fields");
      return;
    }

    try {
      const response = await AdminServices.addSizeRange({
        label: newSize.label,
        dimensions: newSize.dimensions,
        basePrice: parseFloat(newSize.basePrice),
      });
      setSizeRanges(response.settings.sizeRanges);
      setNewSize({ label: "", dimensions: "", basePrice: "" });
      notifySuccess("Size range added successfully");
    } catch (error) {
      notifyError("Error adding size range");
    }
  };

  const handleUpdateSizeRange = async (sizeId, updates) => {
    try {
      const response = await AdminServices.updateSizeRange(sizeId, {
        ...updates,
        basePrice: parseFloat(updates.basePrice),
      });
      setSizeRanges(response.settings.sizeRanges);
      setEditingSize(null);
      notifySuccess("Size range updated successfully");
    } catch (error) {
      notifyError("Error updating size range");
    }
  };

  const handleDeleteSizeRange = async (sizeId) => {
    if (!confirm("Are you sure you want to delete this size range?")) return;

    try {
      const response = await AdminServices.deleteSizeRange(sizeId);
      setSizeRanges(response.settings.sizeRanges);
      notifySuccess("Size range deleted successfully");
    } catch (error) {
      notifyError("Error deleting size range");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <PageTitle>Custom Products</PageTitle>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Enable Custom Sticker Feature on Client Site
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Toggle to enable or disable the custom sticker creation feature
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={featureEnabled}
              onChange={handleToggleFeature}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>

      {/* Manage Sticker Shapes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Manage Sticker Shapes
          </h2>
          <button
            onClick={() => setEditingShape("new")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Shape</span>
          </button>
        </div>

        {editingShape === "new" && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-blue-400">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newShapeName}
                onChange={(e) => setNewShapeName(e.target.value)}
                placeholder="Enter shape name (e.g., Circle, Square)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <button
                onClick={handleAddShape}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setEditingShape(null);
                  setNewShapeName("");
                }}
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shapes.map((shape) => (
            <div
              key={shape._id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shape.enabled}
                    onChange={(e) =>
                      handleUpdateShape(shape._id, {
                        enabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <span className="text-sm text-gray-600">Enabled</span>
                </label>
                <button
                  onClick={() => handleDeleteShape(shape._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {shape.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Manage Size & Price Ranges */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Manage Size & Price Ranges
          </h2>
          <button
            onClick={() => setEditingSize("new")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Size Range</span>
          </button>
        </div>

        {editingSize === "new" && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-blue-400">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
              <input
                type="text"
                value={newSize.label}
                onChange={(e) =>
                  setNewSize({ ...newSize, label: e.target.value })
                }
                placeholder="Label (e.g., Small (2x2))"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <input
                type="text"
                value={newSize.dimensions}
                onChange={(e) =>
                  setNewSize({ ...newSize, dimensions: e.target.value })
                }
                placeholder="Dimensions (e.g., 2x2)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <input
                type="number"
                value={newSize.basePrice}
                onChange={(e) =>
                  setNewSize({ ...newSize, basePrice: e.target.value })
                }
                placeholder="Base Price (₹)"
                step="0.01"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddSizeRange}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setEditingSize(null);
                  setNewSize({ label: "", dimensions: "", basePrice: "" });
                }}
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions (e.g., 2x2)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Price (₹)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sizeRanges.map((size) => (
                <tr key={size._id} className="hover:bg-gray-50">
                  {editingSize === size._id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          defaultValue={size.label}
                          id={`label-${size._id}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          defaultValue={size.dimensions}
                          id={`dimensions-${size._id}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          defaultValue={size.basePrice}
                          id={`price-${size._id}`}
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            const label = document.getElementById(
                              `label-${size._id}`,
                            ).value;
                            const dimensions = document.getElementById(
                              `dimensions-${size._id}`,
                            ).value;
                            const basePrice = document.getElementById(
                              `price-${size._id}`,
                            ).value;
                            handleUpdateSizeRange(size._id, {
                              label,
                              dimensions,
                              basePrice,
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSize(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {size.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {size.dimensions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{size.basePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingSize(size._id)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <FiEdit className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteSizeRange(size._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CustomProducts;

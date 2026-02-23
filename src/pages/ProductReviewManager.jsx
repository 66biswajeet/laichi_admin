import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  Textarea,
} from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import swal from "sweetalert";

//internal import
import ProductReviewServices from "@/services/ProductReviewServices";
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import TableLoading from "@/components/preloader/TableLoading";
import { notifyError, notifySuccess } from "@/utils/toast";

const ProductReviewManager = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { productId } = useParams();

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Form state
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product reviews
  const fetchProductReviews = async () => {
    try {
      setLoading(true);
      const res = await ProductReviewServices.getProductReviews(productId);
      setProductData(res.product);
      setReviews(res.reviews);
      setAverageRating(res.averageRating);
      setTotalReviews(res.totalReviews);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductReviews();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      return notifyError("Reviewer name is required!");
    }
    if (!comment.trim()) {
      return notifyError("Comment is required!");
    }
    if (rating < 1 || rating > 5) {
      return notifyError("Rating must be between 1 and 5!");
    }

    try {
      setIsSubmitting(true);

      const reviewData = {
        productId,
        reviewerName,
        comment,
        rating: Number(rating),
      };

      if (editingReview) {
        await ProductReviewServices.updateProductReview(
          editingReview._id,
          reviewData,
        );
        notifySuccess("Review updated successfully!");
      } else {
        await ProductReviewServices.addProductReview(reviewData);
        notifySuccess("Review added successfully!");
      }

      // Reset form
      setReviewerName("");
      setComment("");
      setRating(5);
      setEditingReview(null);

      // Refresh reviews
      fetchProductReviews();
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setReviewerName(review.reviewerName);
    setComment(review.comment);
    setRating(review.rating);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setReviewerName("");
    setComment("");
    setRating(5);
  };

  const handleDelete = async (reviewId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this review!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await ProductReviewServices.deleteProductReview(reviewId);
          notifySuccess("Review deleted successfully!");
          fetchProductReviews();
        } catch (err) {
          notifyError(err?.response?.data?.message || err.message);
        }
      }
    });
  };

  // Render star rating display
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  // Render star rating selector
  const renderStarSelector = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          className={`text-3xl ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-400 transition-colors`}
        >
          ★
        </button>,
      );
    }
    return stars;
  };

  const productTitle =
    typeof productData?.title === "string"
      ? productData?.title
      : productData?.title?.en || "Product";

  return (
    <>
      <PageTitle>
        <div className="flex items-center gap-2">
          <button
            onClick={() => history.goBack()}
            className="text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <span>
            {t("ManageReviews")} - {productTitle}
          </span>
        </div>
      </PageTitle>

      <AnimatedContent>
        {/* Product Info Card */}
        {productData && (
          <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
            <CardBody>
              <div className="flex items-center gap-4">
                {productData.image && productData.image[0] && (
                  <img
                    className="h-20 w-20 rounded-lg object-cover"
                    src={productData.image[0]}
                    alt={productTitle}
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {productTitle}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-xl">
                        {renderStars(Math.round(averageRating))}
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {averageRating} / 5.0
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({totalReviews}{" "}
                      {totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Add/Edit Review Form */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <h4 className="mb-4 font-semibold text-gray-700 dark:text-gray-200">
              {editingReview ? "Edit Review" : "Add New Review"}
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Reviewer Name */}
                <div>
                  <Label>
                    <span>Reviewer Name</span>
                    <Input
                      className="mt-1"
                      type="text"
                      placeholder="Enter reviewer name"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      required
                    />
                  </Label>
                </div>

                {/* Rating */}
                <div>
                  <Label>
                    <span>Rating</span>
                    <div className="flex gap-1 mt-2">
                      {renderStarSelector()}
                    </div>
                  </Label>
                </div>

                {/* Comment */}
                <div>
                  <Label>
                    <span>Comment</span>
                    <Textarea
                      className="mt-1"
                      rows="4"
                      placeholder="Enter review comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </Label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingReview
                        ? "Update Review"
                        : "Add Review"}
                  </Button>
                  {editingReview && (
                    <Button
                      type="button"
                      layout="outline"
                      onClick={handleCancelEdit}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Reviews List */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <CardBody>
            <h4 className="mb-4 font-semibold text-gray-700 dark:text-gray-200">
              All Reviews ({totalReviews})
            </h4>

            {loading ? (
              <TableLoading row={5} col={5} width={160} height={20} />
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No reviews yet. Add the first review!
              </div>
            ) : (
              <TableContainer className="mb-8">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Reviewer</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell className="text-right">Actions</TableCell>
                    </tr>
                  </TableHeader>
                  <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                    {reviews.map((review) => (
                      <tr key={review._id}>
                        <TableCell>
                          <span className="font-semibold">
                            {review.reviewerName}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex text-lg">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm">{review.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm line-clamp-2">
                            {review.comment}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              layout="link"
                              size="icon"
                              aria-label="Edit"
                              onClick={() => handleEdit(review)}
                            >
                              <FiEdit className="text-lg text-blue-600" />
                            </Button>
                            <Button
                              layout="link"
                              size="icon"
                              aria-label="Delete"
                              onClick={() => handleDelete(review._id)}
                            >
                              <FiTrash2 className="text-lg text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default ProductReviewManager;

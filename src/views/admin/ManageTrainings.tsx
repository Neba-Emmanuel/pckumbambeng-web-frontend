import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Edit, Trash, PlusCircle, Calendar, Users, Clock } from "lucide-react";
import { useApiRequest } from "../../hooks/useApiRequest";
import sweetAlert from "@/src/utils/alerts";
import { showConfirmationDialog } from "@/src/utils/alerts";
import TrainingForm, {
  TrainingFormData,
} from "../../components/admin/TrainingForm";
import { mapTrainingPayload } from "../../utils/mapTrainingPayload";

const ManageTrainings: React.FC = () => {
  const { request, data: trainings, loading, error } = useApiRequest();
  const [showForm, setShowForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    request({
      method: "GET",
      url: "/trainings",
    });
  };

  const handleAddNew = () => {
    setEditingTraining(null);
    setShowForm(true);
  };

  const handleEdit = (training: any) => {
    setEditingTraining(training);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: TrainingFormData) => {
    setFormLoading(true);

    try {
      const mapped = mapTrainingPayload(formData, {
        existingSlug: editingTraining?.slug,
      });

      // Always send as JSON since we're using imageUrl instead of file upload
      const response = await request({
        method: editingTraining ? "PUT" : "POST",
        url: editingTraining
          ? `/trainings/${editingTraining.id}`
          : "/trainings",
        data: mapped,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response);

      sweetAlert({
        icon: "success",
        title: editingTraining
          ? "Training updated successfully"
          : "Training created successfully",
      });

      setShowForm(false);
      fetchTrainings();
    } catch (err: any) {
      console.error("Error:", err);
      sweetAlert({
        icon: "error",
        title: err.response?.data?.error || "Operation failed",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showConfirmationDialog(
      "Delete Training?",
      "This action cannot be undone",
    );

    if (!result.isConfirmed) return;

    try {
      await request({
        method: "DELETE",
        url: `/trainings/${id}`,
      });

      sweetAlert({
        icon: "success",
        title: "Training deleted successfully",
      });

      fetchTrainings();
    } catch {
      sweetAlert({
        icon: "error",
        title: "Failed to delete training",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateTotalSeats = (slots: any[]) => {
    if (!slots || slots.length === 0) return 0;
    return slots.reduce((total, slot) => total + slot.seats, 0);
  };

  const calculateAvailableSeats = (slots: any[]) => {
    if (!slots || slots.length === 0) return 0;
    return slots.reduce((total, slot) => total + slot.availableSeats, 0);
  };

  return (
    <>
      <Helmet>
        <title>Manage Trainings - MTMKay Admin</title>
      </Helmet>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Trainings</h1>
          <Button onClick={handleAddNew}>
            <PlusCircle size={20} className="mr-2" />
            Add New Training
          </Button>
        </div>

        <Card>
          {loading && <p className="p-4 text-gray-500">Loading trainings…</p>}
          {error && (
            <p className="p-4 text-red-600">Failed to load trainings</p>
          )}

          {!loading && trainings && trainings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Slots Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {trainings.map((training: any) => (
                    <tr key={training.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {training.title}
                        </div>
                        {training.summary && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {training.summary}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          {training.price?.toLocaleString()} XAF
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {training.slots && training.slots.length > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Users size={14} className="mr-1 text-gray-400" />
                              <span>
                                {calculateAvailableSeats(training.slots)} /{" "}
                                {calculateTotalSeats(training.slots)} seats
                                available
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar
                                size={14}
                                className="mr-1 text-gray-400"
                              />
                              <span>{training.slots.length} slot(s)</span>
                            </div>

                            {/* Show first upcoming slot schedule */}
                            {training.slots[0]?.schedule && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock
                                  size={14}
                                  className="mr-1 text-gray-400"
                                />
                                <span className="truncate max-w-xs">
                                  {training.slots[0].schedule}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-red-500 italic">
                            No slots configured
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(training.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(training)}
                            className="inline-flex items-center p-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                            title="Edit training"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(training.id)}
                            className="inline-flex items-center p-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete training"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && (!trainings || trainings.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No trainings found</p>
              <Button onClick={handleAddNew}>
                <PlusCircle size={18} className="mr-2" />
                Create Your First Training
              </Button>
            </div>
          )}
        </Card>

        {showForm && (
          <TrainingForm
            training={editingTraining}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTraining(null);
            }}
            loading={formLoading}
          />
        )}
      </div>
    </>
  );
};

export default ManageTrainings;

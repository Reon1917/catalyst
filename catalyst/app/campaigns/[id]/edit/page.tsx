/**
 * Edit Campaign page - Modify existing campaign
 */

interface EditCampaignPageProps {
  params: {
    id: string;
  };
}

export default function EditCampaignPage({ params }: EditCampaignPageProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
        <p className="mt-2 text-gray-600">Editing Campaign ID: {params.id}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Edit Campaign Page - Campaign editing form will be implemented here</p>
      </div>
    </div>
  );
} 
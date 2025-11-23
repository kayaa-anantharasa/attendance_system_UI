export default function LocationList({ locations, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Capacity</th>
            <th className="p-2">Availability</th>
            <th className="p-2">Department</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((loc) => (
            <tr key={loc.id} className="border-t">
              <td className="p-2">{loc.name}</td>
              <td className="p-2">{loc.location_type}</td>
              <td className="p-2">{loc.capacity}</td>
              <td className="p-2">{loc.availability}</td>
              <td className="p-2">{loc.department_id}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => onEdit(loc)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(loc.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

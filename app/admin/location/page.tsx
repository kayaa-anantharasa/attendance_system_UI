"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import LocationList from "../../components/Location/LocationList";
import LocationForm from "../../components/Location/LocationForm";

type LocationType = {
  id: number;
  name: string;
  location_type: string;
  capacity: number;
  availability: string;
  department_id: number;
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [departments, setDepartments] = useState([]);
  const [editing, setEditing] = useState<LocationType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchLocations = async () => {
    const res = await axios.get("http://localhost:5000/api/locations");
    setLocations(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:5000/api/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchLocations();
    fetchDepartments();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Locations</h1>

        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Location
        </button>
      </div>

      <LocationList
        locations={locations}
        onEdit={(loc: LocationType) => {
          setEditing(loc);
          setShowModal(true);
        }}
        onDelete={async (id: number) => {
          await axios.delete(`http://localhost:5000/api/location/${id}`);
          fetchLocations();
        }}
      />

      {showModal && (
        <LocationForm
          editing={editing}
          departments={departments}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            fetchLocations();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

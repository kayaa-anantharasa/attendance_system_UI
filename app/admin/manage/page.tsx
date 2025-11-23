'use client';
import { useEffect, useState } from "react";
import axios from "axios";

interface Lab {
  id: number;
  name: string;
  location: string;
  capacity: number;
}

interface Equipment {
  id: number;
  name: string;
  type: string;
  total_qty: number;
  available_qty: number;
  location: string;
  description: string;
  image_url: string;
}

export default function ManageLabsEquipment() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [newLab, setNewLab] = useState({ name: "", location: "", capacity: 0 });
  const [newEquip, setNewEquip] = useState<Equipment>({
    id: 0,
    name: "",
    type: "",
    total_qty: 0,
    available_qty: 0,
    location: "",
    description: "",
    image_url: "",
  });

  const fetchLabs = async () => {
    const res = await axios.get("http://localhost:5000/api/manage/labs");
    setLabs(res.data);
  };

  const fetchEquipment = async () => {
    const res = await axios.get("http://localhost:5000/api/manage/equipment");
    setEquipment(res.data);
  };

  useEffect(() => {
    fetchLabs();
    fetchEquipment();
  }, []);

  const handleAddLab = async () => {
    await axios.post("http://localhost:5000/api/manage/labs", newLab);
    alert("Lab added");
    setNewLab({ name: "", location: "", capacity: 0 });
    fetchLabs();
  };

  const handleAddEquipment = async () => {
    await axios.post("http://localhost:5000/api/manage/equipment", newEquip);
    alert("Equipment added");
    setNewEquip({ id:0,name:"",type:"",total_qty:0,available_qty:0,location:"",description:"",image_url:""});
    fetchEquipment();
  };

  const handleDeleteLab = async (id: number) => {
    if(!confirm("Delete this lab?")) return;
    await axios.delete(`http://localhost:5000/api/manage/labs/${id}`);
    fetchLabs();
  };

  const handleDeleteEquip = async (id: number) => {
    if(!confirm("Delete this equipment?")) return;
    await axios.delete(`http://localhost:5000/api/manage/equipment/${id}`);
    fetchEquipment();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Labs</h2>
      <div className="mb-4">
        <input placeholder="Lab Name" className="border p-2 mr-2" value={newLab.name} onChange={e=>setNewLab({...newLab,name:e.target.value})}/>
        <input placeholder="Location" className="border p-2 mr-2" value={newLab.location} onChange={e=>setNewLab({...newLab,location:e.target.value})}/>
        <input type="number" placeholder="Capacity" className="border p-2 mr-2" value={newLab.capacity} onChange={e=>setNewLab({...newLab,capacity:Number(e.target.value)})}/>
        <button onClick={handleAddLab} className="px-3 py-1 bg-green-600 text-white rounded">Add Lab</button>
      </div>

      <table className="border w-full mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Capacity</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {labs.map(l=>(
            <tr key={l.id}>
              <td className="border p-2">{l.name}</td>
              <td className="border p-2">{l.location}</td>
              <td className="border p-2">{l.capacity}</td>
              <td className="border p-2">
                <button onClick={()=>handleDeleteLab(l.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mb-4">Manage Equipment</h2>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <input placeholder="Name" className="border p-2" value={newEquip.name} onChange={e=>setNewEquip({...newEquip,name:e.target.value})}/>
        <input placeholder="Type" className="border p-2" value={newEquip.type} onChange={e=>setNewEquip({...newEquip,type:e.target.value})}/>
        <input type="number" placeholder="Total Qty" className="border p-2" value={newEquip.total_qty} onChange={e=>setNewEquip({...newEquip,total_qty:Number(e.target.value)})}/>
        <input type="number" placeholder="Available Qty" className="border p-2" value={newEquip.available_qty} onChange={e=>setNewEquip({...newEquip,available_qty:Number(e.target.value)})}/>
        <input placeholder="Location" className="border p-2" value={newEquip.location} onChange={e=>setNewEquip({...newEquip,location:e.target.value})}/>
        <input placeholder="Description" className="border p-2" value={newEquip.description} onChange={e=>setNewEquip({...newEquip,description:e.target.value})}/>
        <input placeholder="Image URL" className="border p-2" value={newEquip.image_url} onChange={e=>setNewEquip({...newEquip,image_url:e.target.value})}/>
        <button onClick={handleAddEquipment} className="px-3 py-1 bg-green-600 text-white rounded col-span-2">Add Equipment</button>
      </div>

      <table className="border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Total Qty</th>
            <th className="border p-2">Available Qty</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(e=>(
            <tr key={e.id}>
              <td className="border p-2">{e.name}</td>
              <td className="border p-2">{e.type}</td>
              <td className="border p-2">{e.total_qty}</td>
              <td className="border p-2">{e.available_qty}</td>
              <td className="border p-2">{e.location}</td>
              <td className="border p-2">
                <button onClick={()=>handleDeleteEquip(e.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

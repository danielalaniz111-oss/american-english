'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { t } from '@/lib/translations';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, Plus } from 'lucide-react';

interface Class {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  capacity: number;
  price: number;
  _count: {
    bookings: number;
  };
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: 10,
    price: 5000,
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/admin/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(`${formData.date}T${formData.startTime}`);
    const endDate = new Date(`${formData.date}T${formData.endTime}`);
    
    const payload = {
      title: formData.title,
      description: formData.description || null,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      capacity: formData.capacity,
      price: formData.price,
    };

    try {
      const url = editingClass 
        ? `/api/admin/classes/${editingClass.id}`
        : '/api/admin/classes';
      
      const method = editingClass ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchClasses();
        setShowForm(false);
        setEditingClass(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta clase?')) return;
    
    try {
      const response = await fetch(`/api/admin/classes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleEdit = (cls: Class) => {
    const startDate = new Date(cls.startDate);
    const endDate = new Date(cls.endDate);
    
    setFormData({
      title: cls.title,
      description: cls.description || '',
      date: format(startDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
      capacity: cls.capacity,
      price: cls.price,
    });
    
    setEditingClass(cls);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      capacity: 10,
      price: 5000,
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">{t.messages.loading}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t.admin.classes}</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingClass(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          {t.admin.addNewClass}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingClass ? t.admin.editClass : t.admin.addNewClass}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.forms.title}</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t.forms.description}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.admin.date}</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Hora Inicio</label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Hora Fin</label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.admin.capacity}</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t.admin.price} (ARS)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {t.forms.save}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingClass(null);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                {t.forms.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reservas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cls.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(new Date(cls.startDate), 'dd/MM/yyyy', { locale: es })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(new Date(cls.startDate), 'HH:mm')} - 
                    {format(new Date(cls.endDate), 'HH:mm')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{cls.capacity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{cls._count.bookings}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">${cls.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
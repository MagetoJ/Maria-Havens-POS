import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { mockDB } from '@/react-app/data/mockDatabase';

interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roomNumber?: string;
  checkIn?: string;
  checkOut?: string;
  idNumber?: string;
  nationality?: string;
}

export default function GuestsManagement() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    idNumber: '',
    nationality: 'Kenyan'
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const data = await mockDB.getGuests();
      setGuests(data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone?.includes(searchTerm) ||
    guest.roomNumber?.includes(searchTerm)
  );

  const resetForm = () => {
    setGuestForm({
      name: '',
      email: '',
      phone: '',
      roomNumber: '',
      checkInDate: '',
      checkOutDate: '',
      idNumber: '',
      nationality: 'Kenyan'
    });
    setEditingGuest(null);
  };

  const handleAddGuest = async () => {
    if (!guestForm.name) return;

    try {
      if (editingGuest) {
        await mockDB.updateGuest(editingGuest.id, guestForm);
      } else {
        await mockDB.addGuest(guestForm);
      }
      
      await fetchGuests();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving guest:', error);
      alert('Failed to save guest. Please try again.');
    }
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setGuestForm({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      roomNumber: guest.roomNumber || '',
      checkInDate: guest.checkIn || '',
      checkOutDate: guest.checkOut || '',
      idNumber: guest.idNumber || '',
      nationality: guest.nationality || 'Kenyan'
    });
    setShowAddModal(true);
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      try {
        await mockDB.deleteGuest(guestId);
        await fetchGuests();
      } catch (error) {
        console.error('Error deleting guest:', error);
        alert('Failed to delete guest. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Guest Management</h1>
          <p className="text-slate-600">Manage hotel guests and their information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Guest</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Guests</p>
              <p className="text-2xl font-bold text-slate-800">{guests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Checked In</p>
              <p className="text-2xl font-bold text-slate-800">
                {guests.filter(g => g.checkIn && g.checkOut && 
                  new Date(g.checkIn) <= new Date() && new Date(g.checkOut) >= new Date()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Check-ins Today</p>
              <p className="text-2xl font-bold text-slate-800">
                {guests.filter(g => g.checkIn === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">VIP Guests</p>
              <p className="text-2xl font-bold text-slate-800">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search guests by name, email, phone, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Guest</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Room</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Check-in</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Check-out</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Contact</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {guest.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{guest.name}</p>
                        {guest.nationality && (
                          <p className="text-sm text-slate-600">{guest.nationality}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {guest.roomNumber ? (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Room {guest.roomNumber}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-600">
                      {guest.checkIn ? (
                        new Date(guest.checkIn).toLocaleDateString()
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-600">
                      {guest.checkOut ? (
                        new Date(guest.checkOut).toLocaleDateString()
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {guest.email && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {guest.email}
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {guest.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditGuest(guest)}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No guests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingGuest ? 'Edit Guest' : 'Add New Guest'}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={guestForm.name}
                    onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter guest's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={guestForm.email}
                    onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="guest@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={guestForm.phone}
                    onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+254-xxx-xxx-xxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={guestForm.roomNumber}
                    onChange={(e) => setGuestForm({ ...guestForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="101"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Number
                  </label>
                  <input
                    type="text"
                    value={guestForm.idNumber}
                    onChange={(e) => setGuestForm({ ...guestForm, idNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12345678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={guestForm.checkInDate}
                    onChange={(e) => setGuestForm({ ...guestForm, checkInDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={guestForm.checkOutDate}
                    onChange={(e) => setGuestForm({ ...guestForm, checkOutDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nationality
                  </label>
                  <select
                    value={guestForm.nationality}
                    onChange={(e) => setGuestForm({ ...guestForm, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Kenyan">Kenyan</option>
                    <option value="Ugandan">Ugandan</option>
                    <option value="Tanzanian">Tanzanian</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGuest}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingGuest ? 'Update Guest' : 'Add Guest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

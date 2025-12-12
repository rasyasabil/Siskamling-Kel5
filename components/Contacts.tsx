import React from 'react';
import { Phone, Shield, User } from 'lucide-react';
import { Contact } from '../types';

interface ContactsProps {
  contacts: Contact[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => {
  const emergencyContacts = contacts.filter(c => c.isEmergency);
  const regularContacts = contacts.filter(c => !c.isEmergency);

  return (
    <div className="pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Kontak Darurat</h2>

      {/* Emergency Section */}
      <section>
        <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Shield size={16} />
          Panggilan Darurat
        </h3>
        <div className="grid gap-3">
          {emergencyContacts.map(contact => (
            <div key={contact.id} className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">{contact.role}</p>
                <p className="text-sm text-gray-600">{contact.name}</p>
              </div>
              <a href={`tel:${contact.phone}`} className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 active:scale-95 transition-transform">
                <Phone size={20} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Community Directory */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <User size={16} />
          Pengurus Lingkungan
        </h3>
        <div className="grid gap-3">
          {regularContacts.map(contact => (
            <div key={contact.id} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                  <span className="font-bold text-sm">{contact.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.role}</p>
                </div>
              </div>
              <a href={`tel:${contact.phone}`} className="w-9 h-9 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100 hover:bg-green-100">
                <Phone size={18} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contacts;
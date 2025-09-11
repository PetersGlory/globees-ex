import React from 'react'
import {  Text, View, TouchableOpacity, Modal, TextInput, FlatList, Platform } from 'react-native'
import tw from "twrnc"
import Icon from "@expo/vector-icons/Ionicons"
import { countries, Country } from '@/constants/Countries'

interface CustomDropdownProps {
  value?: Country | null;
  onChange: (country: Country) => void;
  placeholder?: string;
  showDialCode?: boolean;
  searchable?: boolean;
  disabled?: boolean;
}

export default function CustomDropdown({
  value = null,
  onChange,
  placeholder = 'Select country',
  showDialCode = true,
  searchable = true,
  disabled = false,
}: CustomDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    if (!query.trim()) return countries
    const q = query.toLowerCase()
    return countries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dialCode.toLowerCase().includes(q)
    )
  }, [query])

  const handleSelect = (c: Country) => {
    onChange(c)
    setOpen(false)
    setQuery('')
  }

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity
        style={tw`flex-row items-center justify-between border border-gray-200 rounded-xl p-4 bg-white`}
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <View style={tw`flex-row items-center flex-1`}>          
          {value ? (
            <View style={tw`flex-row items-center`}>              
              <Text style={tw`text-2xl mr-2`}>{value.flag}</Text>
              <View>
                <Text style={tw`text-gray-900 font-semibold`}>{value.name}</Text>
                {showDialCode && (
                  <Text style={tw`text-gray-500 text-xs`}>{value.code} {value.dialCode}</Text>
                )}
              </View>
            </View>
          ) : (
            <Text style={tw`text-gray-600`}>{placeholder}</Text>
          )}
        </View>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={tw`flex-1 bg-black/40`}>          
          <View style={tw`flex-1 justify-end`}>
            <View style={tw`bg-white rounded-t-3xl p-4 max-h-[75%] shadow-xl`}>              
              {/* Header */}
              <View style={tw`flex-row items-center justify-between mb-3`}>
                <Text style={tw`text-lg font-bold text-gray-900`}>Choose Country</Text>
                <TouchableOpacity onPress={() => setOpen(false)} style={tw`p-2`}>
                  <Icon name='close' size={22} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Search */}
              {searchable && (
                <View style={tw`flex-row items-center border border-gray-200 rounded-xl px-3 py-2 mb-3 bg-gray-50`}>
                  <Icon name='search' size={16} color="#6b7280" />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder='Search by country, code, or dial'
                    placeholderTextColor={'#9ca3af'}
                    style={tw`ml-2 flex-1 text-gray-800 ${Platform.OS === 'ios' ? 'py-2' : ''}`}
                    autoFocus
                  />
                  {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')}>
                      <Icon name='close-circle' size={16} color="#9ca3af" />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* List */}
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.code}
                keyboardShouldPersistTaps='handled'
                initialNumToRender={20}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`flex-row items-center justify-between px-3 py-3 rounded-xl ${value?.code === item.code ? 'bg-blue-50' : 'bg-white'}`}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.8}
                  >
                    <View style={tw`flex-row items-center`}>                      
                      <Text style={tw`text-2xl mr-3`}>{item.flag}</Text>
                      <View>
                        <Text style={tw`text-gray-900 font-medium`}>{item.name}</Text>
                        <Text style={tw`text-gray-500 text-xs`}>{item.code} {showDialCode ? `• ${item.dialCode}` : ''}</Text>
                      </View>
                    </View>
                    {value?.code === item.code ? (
                      <Icon name='checkmark-circle' size={20} color="#2563eb" />
                    ) : (
                      <Icon name='chevron-forward' size={18} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={tw`h-[1px] bg-gray-100`} />}
                ListEmptyComponent={() => (
                  <View style={tw`items-center justify-center py-10`}>
                    <Icon name='alert-circle' size={28} color="#9ca3af" />
                    <Text style={tw`text-gray-500 mt-2`}>No results found</Text>
                  </View>
                )}
                style={tw`-mx-1`}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

import React, { useEffect, useState } from 'react';
import { View, ScrollView, ViewStyle, TextStyle } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Switch,
  DataTable,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Dropdown } from 'react-native-paper-dropdown';
import { nanoid } from 'nanoid/non-secure';

import AppLayout from '../../components/Layout';
import useSnackbar from '../../../backend/hooks/useSnackbar';
import { supabase } from '../../../backend/lib/supabaseClient';
import {
  ROUTES,
  navigateFromSidebar,
  type RootStackParamList,
} from '../../navigator/routes';

/* ---------------- Types ---------------- */

type NavigationProp = DrawerNavigationProp<
  RootStackParamList,
  typeof ROUTES.ItemRegistration
>;

type DropdownOption = {
  label: string;
  value: string;
};

type ItemRow = {
  id: string;
  itemCode: string;
  name: string;
  description: string;
  categoryId: string;
  itemTypeId: string;
  isActive: boolean;
};

/* ---------------- Component ---------------- */

const ItemRegistrationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  /* ---------- Style Constants (Inlined) ---------- */

  // Style for the container View wrapper around TextInput/Dropdown
  const CELL_INPUT_CONTAINER: ViewStyle = {
    paddingVertical: 2,
    justifyContent: 'center',
    flex: 1,
  };

  // Style for the actual TextInput/Dropdown
  const COMPACT_INPUT: ViewStyle = {
    height: 35,
    margin: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    minHeight: 35, // Ensure minHeight is also reduced
  };

  // Base style for all DataTable cells
  const BASE_CELL_STYLE: ViewStyle = {
    paddingHorizontal: 4,
    justifyContent: 'center',
    minWidth: 70, // Default minimal width
  };
  
  // Column-specific cell styles
  const NAME_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 100 };
  const DESCRIPTION_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 100 };
  const DROPDOWN_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 110 };
  const ACTION_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 60 };
  
  /* ---------- Multi Items ---------- */

  const [items, setItems] = useState<ItemRow[]>([]);

  /* ---------- Dropdown Data ---------- */

  const [categoryOptions, setCategoryOptions] = useState<DropdownOption[]>([]);
  const [typeOptions, setTypeOptions] = useState<DropdownOption[]>([]);

  const [dropdownKey, setDropdownKey] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ---------- Snackbar ---------- */

  const { showSnackbar, SnackbarElement } = useSnackbar();

  const currentRouteName = ROUTES.ItemRegistration;

  /* ---------------- Effects and Handlers (omitted for brevity, they are unchanged) ---------------- */
  // ... (Your fetchDropdownData, handleSidebarNavigation, handleAddRow, handleRemoveRow, handleUpdateRow, handleSubmitAll functions remain the same)

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [
        { data: categories, error: categError },
        { data: types, error: typeError },
      ] = await Promise.all([
        supabase.from('types_item_categ').select('id, name').order('name'),
        supabase.from('types_item_type').select('id, name').order('name'),
      ]);

      if (categError) throw categError;
      if (typeError) throw typeError;

      setCategoryOptions(
        categories.map((c) => ({
          label: c.name,
          value: String(c.id),
        }))
      );

      setTypeOptions(
        types.map((t) => ({
          label: t.name,
          value: String(t.id),
        }))
      );
    } catch (err: any) {
      showSnackbar(err.message ?? 'Failed to load dropdown data');
    }
  };

  const handleSidebarNavigation = (route: string) => {
    navigateFromSidebar(navigation, route as any);
  };

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: nanoid(),
        itemCode: '',
        name: '',
        description: '',
        categoryId: '',
        itemTypeId: '',
        isActive: true,
      },
    ]);
    setDropdownKey((k) => k + 1);
  };

  const handleRemoveRow = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof ItemRow, value: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSubmitAll = async () => {
    if (items.length === 0) {
      showSnackbar('No items to submit.');
      return;
    }

    for (let row of items) {
      if (!row.itemCode || !row.name || !row.categoryId || !row.itemTypeId) {
        showSnackbar('Please fill in all required fields (Code, Name, Category, Type).');
        return;
      }
    }

    setLoading(true);

    const payload = items.map((i) => ({
      item_code: i.itemCode.trim(),
      name: i.name.trim(),
      description: i.description ? i.description.trim() : null,
      category_id: Number(i.categoryId),
      item_type_id: Number(i.itemTypeId),
      is_active: i.isActive,
    }));

    const { error } = await supabase.from('tbl_items').insert(payload);
    setLoading(false);

    if (error) {
      showSnackbar(error.message);
      return;
    }

    showSnackbar('Items registered successfully.', true);
    setItems([]);
  };

  /* ---------------- Render ---------------- */

  return (
    <AppLayout
      activeRoute={currentRouteName}
      onProfilePress={() => navigation.navigate(ROUTES.Profile)}
      onNavigate={handleSidebarNavigation}
    >
      {SnackbarElement}

      <View className="gap-2 p-2">
        <Text variant="titleMedium" className="mb-1">Item Registration</Text>

        <Button mode="contained" onPress={handleAddRow} className="mt-2">
          Add Row
        </Button>

        <Button
          mode="contained-tonal"
          onPress={handleSubmitAll}
          loading={loading}
          disabled={loading || items.length === 0}
          className="mt-2"
        >
          Submit All Items
        </Button>

      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            {/* Base Cell Style for Code column (70px) */}
            <DataTable.Title style={BASE_CELL_STYLE}>Code</DataTable.Title>
            {/* Name Column (100px) */}
            <DataTable.Title style={NAME_CELL}>Name</DataTable.Title>
            {/* Description Column (100px) */}
            <DataTable.Title style={DESCRIPTION_CELL}>Desc</DataTable.Title>
            {/* Category Dropdown (110px) */}
            <DataTable.Title style={DROPDOWN_CELL}>Category</DataTable.Title>
            {/* Type Dropdown (110px) */}
            <DataTable.Title style={DROPDOWN_CELL}>Type</DataTable.Title>
            {/* Active Switch (60px) */}
            <DataTable.Title style={ACTION_CELL}>Active</DataTable.Title>
            {/* Actions (60px) */}
            <DataTable.Title numeric style={ACTION_CELL}>
              Actions
            </DataTable.Title>
          </DataTable.Header>

          {items.map((item) => (
            <DataTable.Row key={item.id}>
              {/* Item Code */}
              <DataTable.Cell style={BASE_CELL_STYLE}>
                <View style={CELL_INPUT_CONTAINER}>
                  <TextInput
                    mode="outlined"
                    value={item.itemCode}
                    onChangeText={(v) => handleUpdateRow(item.id, 'itemCode', v)}
                    style={COMPACT_INPUT}
                    dense
                  />
                </View>
              </DataTable.Cell>

              {/* Name */}
              <DataTable.Cell style={NAME_CELL}>
                <View style={CELL_INPUT_CONTAINER}>
                  <TextInput
                    mode="outlined"
                    value={item.name}
                    onChangeText={(v) => handleUpdateRow(item.id, 'name', v)}
                    style={COMPACT_INPUT}
                    dense
                  />
                </View>
              </DataTable.Cell>
              
              {/* Description */}
              <DataTable.Cell style={DESCRIPTION_CELL}>
                <View style={CELL_INPUT_CONTAINER}>
                  <TextInput
                    mode="outlined"
                    value={item.description}
                    onChangeText={(v) => handleUpdateRow(item.id, 'description', v)}
                    style={COMPACT_INPUT}
                    dense
                  />
                </View>
              </DataTable.Cell>

              {/* Category Dropdown */}
              <DataTable.Cell style={DROPDOWN_CELL}>
                <View style={CELL_INPUT_CONTAINER}>
                  <Dropdown
                    key={`cat-${dropdownKey}-${item.id}`}
                    label=""
                    placeholder="Select"
                    options={categoryOptions}
                    value={item.categoryId}
                    onSelect={(v) =>
                      v !== undefined && handleUpdateRow(item.id, 'categoryId', v)
                    }
                    menuContentStyle={{ margin: 0 }}
                  />
                </View>
              </DataTable.Cell>

              {/* Type Dropdown */}
              <DataTable.Cell style={DROPDOWN_CELL}>
                <View style={CELL_INPUT_CONTAINER}>
                  <Dropdown
                    key={`type-${dropdownKey}-${item.id}`}
                    label=""
                    placeholder="Select"
                    options={typeOptions}
                    value={item.itemTypeId}
                    onSelect={(v) =>
                      v !== undefined && handleUpdateRow(item.id, 'itemTypeId', v)
                    }
                    menuContentStyle={{ margin: 0 }}
                  />
                </View>
              </DataTable.Cell>

              {/* Active Switch */}
              <DataTable.Cell style={ACTION_CELL}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Switch
                    value={item.isActive}
                    onValueChange={(v) => handleUpdateRow(item.id, 'isActive', v)}
                    />
                </View>
              </DataTable.Cell>

              {/* Actions */}
              <DataTable.Cell
                numeric
                style={ACTION_CELL}
              >
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => handleRemoveRow(item.id)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
      </View>
    </AppLayout>
  );
};

export default ItemRegistrationScreen;
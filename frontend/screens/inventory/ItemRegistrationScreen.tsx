import { useEffect, useState } from 'react';
import { View, ScrollView, ViewStyle } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Switch,
  DataTable,
  IconButton,
  Card,
  Divider,
  Chip,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Dropdown } from 'react-native-paper-dropdown';
import { nanoid } from 'nanoid/non-secure';

import AppLayout from '../../components/Layout';
import useSnackbar from '../../../backend/hooks/useSnackbar';
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
  const theme = useTheme();

  /* ---------- Style Constants ---------- */

  const CELL_INPUT_CONTAINER: ViewStyle = {
    paddingVertical: 4,
    justifyContent: 'center',
    flex: 1,
  };

  const COMPACT_INPUT: ViewStyle = {
    height: 40,
    margin: 0,
    backgroundColor: 'transparent',
    minHeight: 40,
  };

  const BASE_CELL_STYLE: ViewStyle = {
    paddingHorizontal: 8,
    justifyContent: 'center',
    minHeight: 60,
  };
  
  const CODE_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 120, flex: 0 };
  const NAME_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 150, flex: 0 };
  const DESCRIPTION_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 180, flex: 1 };
  const DROPDOWN_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 140, flex: 0 };
  const SWITCH_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 80, flex: 0 };
  const ACTION_CELL: ViewStyle = { ...BASE_CELL_STYLE, minWidth: 70, flex: 0 };
  
  /* ---------- State ---------- */

  const [items, setItems] = useState<ItemRow[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<DropdownOption[]>([]);
  const [typeOptions, setTypeOptions] = useState<DropdownOption[]>([]);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const { showSnackbar, SnackbarElement } = useSnackbar();
  const currentRouteName = ROUTES.ItemRegistration;

  /* ---------------- Effects and Handlers ---------------- */

  useEffect(() => {
    // Placeholder dropdown data – replace with Supabase queries later.
    const mockCategories: DropdownOption[] = [
      { label: 'IT Equipment', value: '1' },
      { label: 'Furniture', value: '2' },
      { label: 'Vehicles', value: '3' },
    ];
    const mockTypes: DropdownOption[] = [
      { label: 'Asset', value: '1' },
      { label: 'Supply', value: '2' },
      { label: 'Service', value: '3' },
    ];
    setCategoryOptions(mockCategories);
    setTypeOptions(mockTypes);
  }, []);

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
    // Placeholder submit – no backend call yet.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    showSnackbar('Items registered (placeholder only). Supabase integration coming soon.', true);
    setItems([]);
  };

  const handleClearAll = () => {
    setItems([]);
    showSnackbar('All rows cleared.');
  };

  /* ---------------- Render ---------------- */

  return (
    <AppLayout
      activeRoute={currentRouteName}
      onProfilePress={() => navigation.navigate(ROUTES.Profile)}
      onNavigate={handleSidebarNavigation}
    >
      {SnackbarElement}

      <View style={{ flex: 1, padding: 16 }}>
        <Card elevation={2} style={{ marginBottom: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                Item Registration
              </Text>
              {items.length > 0 && (
                <Chip icon="package-variant">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </Chip>
              )}
            </View>
            
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
              Register multiple items at once. Fill in the required fields and submit when ready.
            </Text>

            <Divider style={{ marginBottom: 16 }} />

            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              <Button 
                mode="contained" 
                onPress={handleAddRow}
                icon="plus"
                style={{ flex: 1, minWidth: 140 }}
              >
                Add Row
              </Button>

              <Button
                mode="contained"
                onPress={handleSubmitAll}
                loading={loading}
                disabled={loading || items.length === 0}
                icon="check-all"
                buttonColor={theme.colors.tertiary}
                style={{ flex: 1, minWidth: 140 }}
              >
                Submit All
              </Button>

              {items.length > 0 && (
                <Button
                  mode="outlined"
                  onPress={handleClearAll}
                  icon="delete-sweep"
                  textColor={theme.colors.error}
                  style={{ flex: 1, minWidth: 140 }}
                >
                  Clear All
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>

        {items.length === 0 ? (
          <Card elevation={1}>
            <Card.Content style={{ paddingVertical: 48, alignItems: 'center' }}>
              <IconButton
                icon="package-variant-closed"
                size={64}
                iconColor={theme.colors.onSurfaceVariant}
                disabled
              />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                No items added yet
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, opacity: 0.7 }}>
                Click "Add Row" to start registering items
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <Card elevation={1}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{ minWidth: '100%' }}
            >
              <DataTable style={{ minWidth: 900, width: '100%' }}>
                <DataTable.Header style={{ backgroundColor: theme.colors.surfaceVariant, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                  <DataTable.Title style={CODE_CELL}>
                    <Text style={{ fontWeight: 'bold' }}>Code *</Text>
                  </DataTable.Title>
                  <DataTable.Title style={NAME_CELL}>
                    <Text style={{ fontWeight: 'bold' }}>Name *</Text>
                  </DataTable.Title>
                  <DataTable.Title style={DESCRIPTION_CELL}>
                    <Text style={{ fontWeight: 'bold' }}>Description</Text>
                  </DataTable.Title>
                  <DataTable.Title style={DROPDOWN_CELL}>
                    <Text style={{ fontWeight: 'bold' }}>Category *</Text>
                  </DataTable.Title>
                  <DataTable.Title style={DROPDOWN_CELL}>
                    <Text style={{ fontWeight: 'bold' }}>Type *</Text>
                  </DataTable.Title>
                  <DataTable.Title style={SWITCH_CELL}>
                    <Text style={{ fontWeight: 'bold' }}>Active</Text>
                  </DataTable.Title>
                  <DataTable.Title numeric style={ACTION_CELL}>
                    <Text style={{ fontWeight: 'bold' }}>Actions</Text>
                  </DataTable.Title>
                </DataTable.Header>

                {items.map((item, index) => (
                  <DataTable.Row 
                    key={item.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? theme.colors.surface : theme.colors.surfaceVariant,
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.outlineVariant
                    }}
                  >
                    <DataTable.Cell style={CODE_CELL}>
                      <View style={CELL_INPUT_CONTAINER}>
                        <TextInput
                          mode="outlined"
                          value={item.itemCode}
                          onChangeText={(v) => handleUpdateRow(item.id, 'itemCode', v)}
                          style={COMPACT_INPUT}
                          dense
                          placeholder="Enter code"
                          error={!item.itemCode}
                        />
                      </View>
                    </DataTable.Cell>

                    <DataTable.Cell style={NAME_CELL}>
                      <View style={CELL_INPUT_CONTAINER}>
                        <TextInput
                          mode="outlined"
                          value={item.name}
                          onChangeText={(v) => handleUpdateRow(item.id, 'name', v)}
                          style={COMPACT_INPUT}
                          dense
                          placeholder="Enter name"
                          error={!item.name}
                        />
                      </View>
                    </DataTable.Cell>
                    
                    <DataTable.Cell style={DESCRIPTION_CELL}>
                      <View style={CELL_INPUT_CONTAINER}>
                        <TextInput
                          mode="outlined"
                          value={item.description}
                          onChangeText={(v) => handleUpdateRow(item.id, 'description', v)}
                          style={COMPACT_INPUT}
                          dense
                          placeholder="Optional description"
                        />
                      </View>
                    </DataTable.Cell>

                    <DataTable.Cell style={DROPDOWN_CELL}>
                      <View style={CELL_INPUT_CONTAINER}>
                        <Dropdown
                          key={`cat-${dropdownKey}-${item.id}`}
                          label=""
                          placeholder="Select category"
                          options={categoryOptions}
                          value={item.categoryId}
                          onSelect={(v) =>
                            v !== undefined && handleUpdateRow(item.id, 'categoryId', v)
                          }
                          hideMenuHeader
                          menuContentStyle={{ margin: 0 }}
                          mode="outlined"
                        />
                      </View>
                    </DataTable.Cell>

                    <DataTable.Cell style={DROPDOWN_CELL}>
                      <View style={CELL_INPUT_CONTAINER}>
                        <Dropdown
                          key={`type-${dropdownKey}-${item.id}`}
                          label=""
                          placeholder="Select type"
                          options={typeOptions}
                          value={item.itemTypeId}
                          onSelect={(v) =>
                            v !== undefined && handleUpdateRow(item.id, 'itemTypeId', v)
                          }
                          hideMenuHeader
                          menuContentStyle={{ margin: 0 }}
                          mode="outlined"
                        />
                      </View>
                    </DataTable.Cell>

                    <DataTable.Cell style={SWITCH_CELL}>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Switch
                          value={item.isActive}
                          onValueChange={(v) => handleUpdateRow(item.id, 'isActive', v)}
                        />
                      </View>
                    </DataTable.Cell>

                    <DataTable.Cell numeric style={ACTION_CELL}>
                      <IconButton
                        icon="delete"
                        size={20}
                        iconColor={theme.colors.error}
                        onPress={() => handleRemoveRow(item.id)}
                        mode="contained-tonal"
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
          </Card>
        )}
      </View>
    </AppLayout>
  );
};

export default ItemRegistrationScreen;
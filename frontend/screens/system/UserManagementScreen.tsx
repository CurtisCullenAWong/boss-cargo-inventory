import { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, Platform } from 'react-native';
import {
  Text,
  Card,
  DataTable,
  Button,
  Avatar,
  ActivityIndicator,
  Portal,
  Dialog,
  TextInput,
  useTheme,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AppLayout from '../../components/Layout';
import { ROUTES, navigateFromSidebar, type RootStackParamList } from '../../navigator/routes';
import { Dropdown } from 'react-native-paper-dropdown';
import useSnackbar from '../../../backend/hooks/useSnackbar';

type NavigationProp = DrawerNavigationProp<RootStackParamList, typeof ROUTES.UserManagement>;

interface User {
  user_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  contact_number: string | null;
  is_active: boolean | null;
  created_at: string;
  user_role: { role_name: string } | null;
  department: { department_name: string } | null;
}

type AccountAction = 'viewEdit' | 'toggleActive';

const MOCK_USERS: User[] = [
  {
    user_id: '1',
    username: 'jdoe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    contact_number: '+63 912 345 6789',
    is_active: true,
    created_at: new Date().toISOString(),
    user_role: { role_name: 'Administrator' },
    department: { department_name: 'IT Department' },
  },
  {
    user_id: '2',
    username: 'asmith',
    first_name: 'Anna',
    last_name: 'Smith',
    email: 'anna.smith@example.com',
    contact_number: '+63 923 456 7890',
    is_active: false,
    created_at: new Date().toISOString(),
    user_role: { role_name: 'Custodian' },
    department: { department_name: 'Logistics' },
  },
];

const UserManagementScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const currentRouteName = ROUTES.UserManagement;
  const { showSnackbar, SnackbarElement } = useSnackbar();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(10);
  const [isModalVisible, setModalVisible] = useState(false);

  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [formUsername, setFormUsername] = useState('');
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formContactNumber, setFormContactNumber] = useState('');
  const [formRole, setFormRole] = useState<string>('');
  const [formDepartment, setFormDepartment] = useState<string>('');

  const [rowActionValues, setRowActionValues] = useState<Record<string, AccountAction | ''>>({});

  const from = page * numberOfItemsPerPage;
  const to = from + numberOfItemsPerPage - 1;

  const windowWidth = Dimensions.get('window').width;
  const isSmallScreen = windowWidth < 768;
  const isWeb = Platform.OS === 'web';

  const roleOptions = [
    { label: 'Administrator', value: 'Administrator' },
    { label: 'Custodian', value: 'Custodian' },
    { label: 'Viewer', value: 'Viewer' },
  ];

  const departmentOptions = [
    { label: 'IT Department', value: 'IT Department' },
    { label: 'Logistics', value: 'Logistics' },
    { label: 'Finance', value: 'Finance' },
  ];

  useEffect(() => {
    // Placeholder fetch – replace with Supabase when backend is wired.
    setLoading(true);
    const timeout = setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);
  
  const handleSidebarNavigation = (route: string) => {
    navigateFromSidebar(navigation, route as any);
  };

  const openCreateModal = () => {
    setDialogMode('create');
    setSelectedUserId(null);
    setFormUsername('');
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormContactNumber('');
    setFormRole('');
    setFormDepartment('');
    setModalVisible(true);
  };

  const openEditModal = (user: User) => {
    setDialogMode('edit');
    setSelectedUserId(user.user_id);
    setFormUsername(user.username || '');
    setFormFirstName(user.first_name || '');
    setFormLastName(user.last_name || '');
    setFormEmail(user.email || '');
    setFormContactNumber(user.contact_number || '');
    setFormRole(user.user_role?.role_name || '');
    setFormDepartment(user.department?.department_name || '');
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);

  const handleSaveAccount = () => {
    if (!formUsername || !formFirstName || !formLastName || !formEmail) {
      showSnackbar('Please fill in all required fields.');
      return;
    }

    if (dialogMode === 'create') {
      const newUser: User = {
        user_id: Date.now().toString(),
        username: formUsername,
        first_name: formFirstName,
        last_name: formLastName,
        email: formEmail,
        contact_number: formContactNumber,
        is_active: true,
        created_at: new Date().toISOString(),
        user_role: formRole ? { role_name: formRole } : null,
        department: formDepartment ? { department_name: formDepartment } : null,
      };
      setUsers((prev) => [newUser, ...prev]);
      showSnackbar('Account created (placeholder only).', true);
    } else if (dialogMode === 'edit' && selectedUserId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === selectedUserId
            ? {
                ...u,
                username: formUsername,
                first_name: formFirstName,
                last_name: formLastName,
                email: formEmail,
                contact_number: formContactNumber,
                user_role: formRole ? { role_name: formRole } : null,
                department: formDepartment ? { department_name: formDepartment } : null,
              }
            : u,
        ),
      );
      showSnackbar('Account updated (placeholder only).', true);
    }

    setModalVisible(false);
  };

  const handleToggleActive = (user: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === user.user_id ? { ...u, is_active: !u.is_active } : u,
      ),
    );
    showSnackbar(
      `Account ${user.is_active ? 'disabled' : 'enabled'} (placeholder only).`,
      true,
    );
  };

  const handleRowActionChange = (user: User, action: AccountAction | '') => {
    setRowActionValues((prev) => ({ ...prev, [user.user_id]: action }));

    if (!action) return;
    if (action === 'viewEdit') {
      openEditModal(user);
    } else if (action === 'toggleActive') {
      handleToggleActive(user);
    }

    // Reset selection after handling to allow re-selection.
    setTimeout(() => {
      setRowActionValues((prev) => ({ ...prev, [user.user_id]: '' }));
    }, 0);
  };

  const paginatedUsers = users.slice(
    page * numberOfItemsPerPage,
    (page + 1) * numberOfItemsPerPage,
  );

  const UserFormModal = () => (
    <Portal>
      <Dialog visible={isModalVisible} onDismiss={hideModal}>
        <Dialog.Title>
          {dialogMode === 'create' ? 'Add Account' : 'View / Edit Account'}
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Username"
            mode="outlined"
            dense
            value={formUsername}
            onChangeText={setFormUsername}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="First Name"
            mode="outlined"
            dense
            value={formFirstName}
            onChangeText={setFormFirstName}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Last Name"
            mode="outlined"
            dense
            value={formLastName}
            onChangeText={setFormLastName}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Email"
            mode="outlined"
            dense
            keyboardType="email-address"
            value={formEmail}
            onChangeText={setFormEmail}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Contact Number"
            mode="outlined"
            dense
            keyboardType="phone-pad"
            value={formContactNumber}
            onChangeText={setFormContactNumber}
            style={{ marginBottom: 8 }}
          />
          <Dropdown
            label="Role"
            mode="outlined"
            placeholder="Select role"
            value={formRole}
            options={roleOptions}
            onSelect={(v) => v !== undefined && setFormRole(String(v))}
          />
          <View style={{ height: 8 }} />
          <Dropdown
            label="Department"
            mode="outlined"
            placeholder="Select department"
            value={formDepartment}
            options={departmentOptions}
            onSelect={(v) => v !== undefined && setFormDepartment(String(v))}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideModal}>Cancel</Button>
          <Button onPress={handleSaveAccount}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return (
    <AppLayout
      activeRoute={currentRouteName}
      onProfilePress={() => navigation.navigate(ROUTES.Profile)}
      onNavigate={handleSidebarNavigation}
    >
      {SnackbarElement}
      <UserFormModal />
      <View className="gap-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text variant="headlineLarge" className="font-bold">
            Accounts 👥
          </Text>
          <Button icon="plus" mode="contained" onPress={openCreateModal}>
            Add Account
          </Button>
        </View>

        <Card>
          <Card.Content>
            {loading ? (
              <ActivityIndicator animating={true} size="large" className="my-8" />
            ) : (
              <>
                {isWeb ? (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{ minWidth: '100%' }}
                  >
                    <DataTable style={{ minWidth: 1200, width: '100%' }}>
                      <DataTable.Header>
                        {!isSmallScreen && (
                          <DataTable.Title style={{ minWidth: 60, flex: 0 }}>Avatar</DataTable.Title>
                        )}
                        <DataTable.Title style={{ minWidth: 150, flex: 0 }}>Username</DataTable.Title>
                        <DataTable.Title style={{ minWidth: 200, flex: 0 }}>Full Name</DataTable.Title>
                        <DataTable.Title style={{ minWidth: 250, flex: 1 }}>Email</DataTable.Title>
                        {!isSmallScreen && (
                          <DataTable.Title style={{ minWidth: 160, flex: 0 }}>Role</DataTable.Title>
                        )}
                        {!isSmallScreen && (
                          <DataTable.Title style={{ minWidth: 180, flex: 0 }}>Department</DataTable.Title>
                        )}
                        <DataTable.Title style={{ minWidth: 110, flex: 0 }}>Status</DataTable.Title>
                        <DataTable.Title style={{ minWidth: 180, flex: 0 }} numeric>
                          Actions
                        </DataTable.Title>
                      </DataTable.Header>

                      {paginatedUsers.map((user) => (
                        <DataTable.Row key={user.user_id}>
                          {!isSmallScreen && (
                            <DataTable.Cell style={{ minWidth: 60, flex: 0 }}>
                              <Avatar.Text
                                size={32}
                                label={user.first_name?.charAt(0) || 'N'}
                              />
                            </DataTable.Cell>
                          )}
                          <DataTable.Cell style={{ minWidth: 150, flex: 0 }}>
                            {user.username}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ minWidth: 200, flex: 0 }}>
                            {`${user.first_name || ''} ${user.last_name || ''}`}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ minWidth: 250, flex: 1 }}>
                            {user.email}
                          </DataTable.Cell>
                          {!isSmallScreen && (
                            <DataTable.Cell style={{ minWidth: 160, flex: 0 }}>
                              {user.user_role?.role_name || 'N/A'}
                            </DataTable.Cell>
                          )}
                          {!isSmallScreen && (
                            <DataTable.Cell style={{ minWidth: 180, flex: 0 }}>
                              {user.department?.department_name || 'N/A'}
                            </DataTable.Cell>
                          )}
                          <DataTable.Cell style={{ minWidth: 110, flex: 0 }}>
                            <Chip
                              compact
                              mode="outlined"
                              style={{
                                borderColor: user.is_active
                                  ? theme.colors.tertiary
                                  : theme.colors.error,
                              }}
                              textStyle={{
                                color: user.is_active
                                  ? theme.colors.tertiary
                                  : theme.colors.error,
                              }}
                            >
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Chip>
                          </DataTable.Cell>
                          <DataTable.Cell style={{ minWidth: 180, flex: 0 }}>
                            <Dropdown
                              label=""
                              placeholder="Account actions"
                              value={rowActionValues[user.user_id] || ''}
                              options={[
                                {
                                  label: 'View / Edit account',
                                  value: 'viewEdit',
                                },
                                {
                                  label: user.is_active
                                    ? 'Disable account'
                                    : 'Enable account',
                                  value: 'toggleActive',
                                },
                              ]}
                              onSelect={(v) =>
                                handleRowActionChange(
                                  user,
                                  (v as AccountAction | undefined) ?? '',
                                )
                              }
                              hideMenuHeader
                              mode="outlined"
                            />
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}

                      <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(users.length / numberOfItemsPerPage)}
                        onPageChange={(p) => setPage(p)}
                        label={`${from + 1}-${Math.min(
                          (page + 1) * numberOfItemsPerPage,
                          users.length,
                        )} of ${users.length}`}
                        numberOfItemsPerPageList={[10, 20, 50]}
                        numberOfItemsPerPage={numberOfItemsPerPage}
                        onItemsPerPageChange={setNumberOfItemsPerPage}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                      />
                    </DataTable>
                  </ScrollView>
                ) : (
                  <ScrollView>
                    {users.map((user) => (
                      <Card
                        key={user.user_id}
                        style={{ marginBottom: 12 }}
                        mode="elevated"
                      >
                        <Card.Content>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 8,
                            }}
                          >
                            <Avatar.Text
                              size={40}
                              label={user.first_name?.charAt(0) || 'N'}
                            />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                              <Text variant="titleMedium">
                                {user.first_name} {user.last_name}
                              </Text>
                              <Text
                                variant="bodySmall"
                                style={{ color: theme.colors.onSurfaceVariant }}
                              >
                                {user.email}
                              </Text>
                            </View>
                            <Chip
                              compact
                              mode="outlined"
                              style={{
                                borderColor: user.is_active
                                  ? theme.colors.tertiary
                                  : theme.colors.error,
                              }}
                              textStyle={{
                                color: user.is_active
                                  ? theme.colors.tertiary
                                  : theme.colors.error,
                              }}
                            >
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Chip>
                          </View>

                          <View style={{ marginBottom: 8 }}>
                            <Text
                              variant="bodySmall"
                              style={{ color: theme.colors.onSurfaceVariant }}
                            >
                              Role: {user.user_role?.role_name || 'N/A'}
                            </Text>
                            <Text
                              variant="bodySmall"
                              style={{ color: theme.colors.onSurfaceVariant }}
                            >
                              Department: {user.department?.department_name || 'N/A'}
                            </Text>
                            {user.contact_number && (
                              <Text
                                variant="bodySmall"
                                style={{ color: theme.colors.onSurfaceVariant }}
                              >
                                Contact: {user.contact_number}
                              </Text>
                            )}
                          </View>

                          <Dropdown
                            label="Account actions"
                            mode="outlined"
                            value={rowActionValues[user.user_id] || ''}
                            options={[
                              {
                                label: 'View / Edit account',
                                value: 'viewEdit',
                              },
                              {
                                label: user.is_active
                                  ? 'Disable account'
                                  : 'Enable account',
                                value: 'toggleActive',
                              },
                            ]}
                            onSelect={(v) =>
                              handleRowActionChange(
                                user,
                                (v as AccountAction | undefined) ?? '',
                              )
                            }
                            placeholder="Select action"
                          />
                        </Card.Content>
                      </Card>
                    ))}
                  </ScrollView>
                )}
              </>
            )}
          </Card.Content>
        </Card>
      </View>
    </AppLayout>
  );
};

export default UserManagementScreen;
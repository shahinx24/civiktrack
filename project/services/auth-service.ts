import { User, UserRole } from "@/types/user";
import { MOCK_USERS } from "@/mock/users";
import { ApiClient } from "./api-client";

// Active session state defaulted to Resident Alex Morgan
let activeUser: User = { ...MOCK_USERS[0] };

export const AuthService = {
  async getCurrentUser(): Promise<User> {
    await ApiClient.simulateDelay(50);
    return { ...activeUser };
  },

  async switchRole(role: UserRole): Promise<User> {
    await ApiClient.simulateDelay(150);
    const targetUser = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    activeUser = { ...targetUser };
    return { ...activeUser };
  },

  async login(email: string, role?: UserRole): Promise<User> {
    await ApiClient.simulateDelay(300);
    const found =
      MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
      (role ? MOCK_USERS.find((u) => u.role === role) : null) ||
      MOCK_USERS[0];

    activeUser = { ...found };
    return { ...activeUser };
  },

  async register(name: string, email: string, ward: string): Promise<User> {
    await ApiClient.simulateDelay(400);
    const newUser: User = {
      id: `usr-resident-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role: "resident",
      ward,
      createdAt: new Date().toISOString(),
    };
    activeUser = newUser;
    return { ...newUser };
  },

  async getAllMockUsers(): Promise<User[]> {
    await ApiClient.simulateDelay(100);
    return [...MOCK_USERS];
  },
};


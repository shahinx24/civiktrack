import { Department } from "@/types/department";
import { MOCK_DEPARTMENTS } from "@/mock/departments";
import { ApiClient } from "./api-client";

let departmentStore: Department[] = [...MOCK_DEPARTMENTS];

export const DepartmentService = {
  async getDepartments(): Promise<Department[]> {
    await ApiClient.simulateDelay(150);
    return [...departmentStore];
  },

  async getDepartmentById(id: string): Promise<Department | null> {
    await ApiClient.simulateDelay(100);
    const dept = departmentStore.find((d) => d.id === id);
    return dept ? { ...dept } : null;
  },

  async updateDepartment(
    id: string,
    updates: Partial<Department>
  ): Promise<Department | null> {
    await ApiClient.simulateDelay(250);
    const index = departmentStore.findIndex((d) => d.id === id);
    if (index === -1) return null;

    departmentStore[index] = { ...departmentStore[index], ...updates };
    return { ...departmentStore[index] };
  },
};


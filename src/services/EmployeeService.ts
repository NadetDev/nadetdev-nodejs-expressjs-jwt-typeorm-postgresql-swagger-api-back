import { Employee, EmployeeStatus } from '../entities/Employee';

import { AppDataSource } from '../config/database';

export class EmployeeService {
  private employeeRepository = AppDataSource.getRepository(Employee);

  async getAllEmployees() {
    return await this.employeeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getEmployeeById(id: number) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new Error('Employé non trouvé');
    }
    return employee;
  }

  async createEmployee(employeeData: {
    prenom: string;
    nom: string;
    fonction: string;
    dateRecrutement: string;
    statut?: EmployeeStatus;
  }) {
    const employee = this.employeeRepository.create({
      ...employeeData,
      dateRecrutement: new Date(employeeData.dateRecrutement),
      statut: employeeData.statut || EmployeeStatus.ACTIVE,
    });

    return await this.employeeRepository.save(employee);
  }

  async updateEmployee(
    id: number,
    employeeData: {
      prenom?: string;
      nom?: string;
      fonction?: string;
      dateRecrutement?: string;
      statut?: EmployeeStatus;
    }
  ) {
    const employee = await this.getEmployeeById(id);

    if (employeeData.prenom) employee.prenom = employeeData.prenom;
    if (employeeData.nom) employee.nom = employeeData.nom;
    if (employeeData.fonction) employee.fonction = employeeData.fonction;
    if (employeeData.dateRecrutement)
      employee.dateRecrutement = new Date(employeeData.dateRecrutement);
    if (employeeData.statut) employee.statut = employeeData.statut;

    return await this.employeeRepository.save(employee);
  }

  async deleteEmployee(id: number) {
    const employee = await this.getEmployeeById(id);
    await this.employeeRepository.remove(employee);
    return { message: 'Employé supprimé avec succès' };
  }

  async getEmployeesByStatus(statut: EmployeeStatus) {
    return await this.employeeRepository.find({
      where: { statut },
      order: { createdAt: 'DESC' },
    });
  }

  async searchEmployees(searchTerm: string) {
    return await this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.prenom ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('employee.nom ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('employee.fonction ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('employee.createdAt', 'DESC')
      .getMany();
  }
}

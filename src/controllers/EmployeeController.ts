import { AuthRequest } from '../middlewares/auth';
import { EmployeeService } from '../services/EmployeeService';
import { EmployeeStatus } from '../entities/Employee';
import { Response } from 'express';

export class EmployeeController {
  private employeeService = new EmployeeService();

  getAllEmployees = async (req: AuthRequest, res: Response) => {
    try {
      const { status, search } = req.query;

      let employees;

      if (search) {
        employees = await this.employeeService.searchEmployees(
          search as string
        );
      } else if (status) {
        employees = await this.employeeService.getEmployeesByStatus(
          status as EmployeeStatus
        );
      } else {
        employees = await this.employeeService.getAllEmployees();
      }

      res.json({
        message: 'Employés récupérés avec succès',
        employees,
        count: employees.length,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getEmployeeById = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.getEmployeeById(parseInt(id));

      res.json({
        message: 'Employé récupéré avec succès',
        employee,
      });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };

  createEmployee = async (req: AuthRequest, res: Response) => {
    try {
      const { prenom, nom, fonction, dateRecrutement, statut } = req.body;

      if (!prenom || !nom || !fonction || !dateRecrutement) {
        return res.status(400).json({
          message: 'Prénom, nom, fonction et date de recrutement sont requis',
        });
      }

      const employee = await this.employeeService.createEmployee({
        prenom,
        nom,
        fonction,
        dateRecrutement,
        statut,
      });

      res.status(201).json({
        message: 'Employé créé avec succès',
        employee,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateEmployee = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { prenom, nom, fonction, dateRecrutement, statut } = req.body;

      const employee = await this.employeeService.updateEmployee(parseInt(id), {
        prenom,
        nom,
        fonction,
        dateRecrutement,
        statut,
      });

      res.json({
        message: 'Employé mis à jour avec succès',
        employee,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteEmployee = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.employeeService.deleteEmployee(parseInt(id));

      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };
}

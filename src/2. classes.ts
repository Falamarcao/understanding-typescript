// abstract classes can't be instantiated. - It's used for Inheritance.
abstract class Department {
  static fiscalYear: number = 2024;
  //   private readonly id: string;
  //   private name: string;
  protected employees: string[] = []; // protected is like private, but the property can be accessed by Inherited classes.

  //   constructor(id: string, name: string) {
  //     this.id = id;
  //     this.name = name;
  //   }

  constructor(protected readonly id: string, public name: string) {} // shorterhand initialization

  static createEmployee(name: string) {
    return { name: name };
  }

  abstract describe(this: Department): void; // force a method be implemented on Inherited classes.

  addEmployee(name: string) {
    // this.id = 'new_id'; // ERROR: readonly property
    this.employees.push(name);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

const employee1 = Department.createEmployee('Anna');
console.log(employee1, Department.fiscalYear);


// Singleton Pattern - only one instance of MarketingDepartment can exists.
// private constructor, getInstance method.
class MarketingDepartment extends Department {
  private lastReport: string;
  private static instance: MarketingDepartment;

  private constructor(id: string, private reports: string[] = []) {
    super(id, 'Marketing');

    this.lastReport = reports[0];
  }

  static getInstance(id: string, reports: string[] = []) {
    if (MarketingDepartment.instance) {
      return this.instance;
    }
    this.instance = new MarketingDepartment(id = id, reports = reports);
    return this.instance;
  }

  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error('No report found');
  }

  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error('Please pass in a valid value!');
    }
    this.addReport(value);
  }

  describe() {
    console.log('Marketing Department - ID ' + this.id);
  }

  // overriding addEmployee method
  addEmployee(name: string): void {
    if (name === 'Max') {
      return;
    }
    this.employees.push(name);
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  printReports() {
    console.log(this.reports);
  }
}

const marketing = MarketingDepartment.getInstance('mkt_1'); // singleton

marketing.mostRecentReport = '20 Clicks';
marketing.addReport('100 Clicks');
console.log(marketing.mostRecentReport);

marketing.addEmployee('Max Heck');
marketing.addEmployee('John Smith');

// marketing.employees[2] = 'Anna'; // ERROR: employees is private

marketing.describe();
marketing.printEmployeeInformation();
marketing.printReports();

// const marketing2 = { name: 'Marketing', describe: marketing.describe };
// marketing2.describe();

class ITDepartment extends Department {
  admins: string[];

  constructor(id: string, admins: string[]) {
    super(id, 'IT');
    this.admins = admins;
  }

  describe(): void {
    console.log('IT Department admins: ' + this.admins);
  }
}

const backend = new ITDepartment('bckd_1', ['Tim Smith', 'John Smith']);

backend.addEmployee('Max Bezos');
backend.addEmployee('Olivia Smith');

backend.describe();
backend.printEmployeeInformation();
console.log(backend.admins);

//
// Generics
//

const names: Array<string> = ['Manuel', 'Julia']; // Option 1
const names_2: string[] = ['Manuel', 'Julia']; // Option 2

const promise: Promise<string> = new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve('This is done!');
    }, 1);
    // throw new Error;
  } catch (err) {
    reject(-1);
  }
});

promise.then((data) => {
  console.log(data.split(' '));
});

//
// Creating a Generic Function and Constraints
//

function merge<T extends Object, U extends {}>(objA: T, objB: U): T & U {
  return Object.assign(objA, objB);
}

const mergedObject = merge({ name: 'Manuel' }, { age: '41' });
console.log(mergedObject.age, mergedObject.name);

interface Lengthy {
  length: number;
}

function countAndPrint<T extends Lengthy>(element: T): [T, string] {
  let description = 'Got no value.';
  if (element.length > 0) {
    description = `Got ${element.length} element${
      element.length > 1 ? 's' : ''
    }`;
  }
  return [element, description];
}

console.log(countAndPrint([]));
console.log(countAndPrint('Hello World!'));
console.log(countAndPrint([1, 2, 3, 4]));

//
// `keyof` Constraint
//

function extractAndConvert<T extends Object, K extends keyof T>(
  obj: T,
  key: K
): string {
  return 'Value: ' + obj[key];
}

console.log(extractAndConvert({ name: 'Albert' }, 'name'));

//
// Generic Classes
//

class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T): void {
    this.data.push(item);
  }

  removeItem(item: T): void {
    const index = this.data.indexOf(item);

    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }

  getItems(): Array<T> { // `Array[T]` is the same as `T[]`.
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Item 1');
textStorage.addItem('Item 2');
textStorage.removeItem('Item 1');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();
numberStorage.addItem(1);
numberStorage.addItem(55);
numberStorage.removeItem(1);
console.log(numberStorage.getItems());

// const objStorage = new DataStorage<object>();
// const myobj = { name: 'Robert' };
// objStorage.addItem(myobj);
// objStorage.addItem({ music: 'Jingle Bells' });
// objStorage.removeItem(myobj);
// console.log(objStorage.getItems());

//
// Generic Utility Types
//

interface CourseGoal {
  title: string;
  description: string;
  compleUntil: Date;
}

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {}; // Temporarily ALL the properties of the `interface CourseGoal` are optional.

  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.compleUntil = date;

  return courseGoal as CourseGoal;
}

const list_of_names: Readonly<string[]> = ['Anna', 'Julia'];
// list_of_names.push('Manu'); // Error: `list_of_names` is readonly.
// list_of_names.pop(); // Error: `list_of_names` is readonly.
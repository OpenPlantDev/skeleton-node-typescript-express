// Node.js + Express server backend
// use SQLite (https://www.sqlite.org/index.html) as a database
//

// run this once to create the initial database file
//   node create_database.js

// to clear the database, simply delete the database file:

const sqlite3 = require('sqlite3');
const dbName = 'model.db';
const db = new sqlite3.Database(dbName);

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database tables:
  db.run("CREATE TABLE elements (id INTEGER PRIMARY KEY, elemType TEXT, class TEXT, name TEXT, properties TEXT)");

  let valve = {
    elemType: "component",
    class: "valve",
    name: "V-100",
    props: [ { desc: 'Gate Valve' }, { length: 50 }, { weight: 100 } ],
  };

  let pump = {
    elemType: "component",
    class: "pump",
    name: "P-100",
    props: [{desc:"Centrifugal Pump"}, {manufacturer: "ABC"}],
  };

  let tank = {
    elemType: "component",
    class: "tank",
    name: "T-100",
    props: [{desc:"Horizontal Tank"},{manufacturer: "XYZ"}],
  };

  let sql = `INSERT INTO elements (elemType, class, name, properties)  VALUES 
    ('${valve.elemType}', '${valve.class}', '${valve.name}', '${JSON.stringify(valve.props)}'),
    ('${valve.elemType}', '${pump.class}', '${pump.name}', '${JSON.stringify(pump.props)}'),
    ('${valve.elemType}', '${tank.class}', '${tank.name}', '${JSON.stringify(tank.props)}')
  `;

  console.log (sql);
  // insert data into components table:
  db.run(sql);
         
  console.log(`successfully added components to the element table in ${dbName}`);

const u1 = { elemType: "wbsitem", id: "1", class: "unit", name: "U1", props: [{desc: "Unit #1"}] };
const u2 = { elemType: "wbsitem", id: "2", class: "unit", name: "U2", props: [{desc: "Unit #2"}] };
const s1 = { elemType: "wbsitem", id: "3", class: "service", name: "S1", props: [{desc: "Service #1"}] };
const a1 = { elemType: "wbsitem", id: "4", class: "area", name: "A1", props: [{desc: "Area #1"}] };

  // insert data into wbsitems table:
  db.run(`INSERT INTO elements (elemType, class, name, properties)  VALUES 
                      ('${u1.elemType}', '${u1.class}', '${u1.name}', '${JSON.stringify(u1.props)}'),
                      ('${u2.elemType}', '${u2.class}', '${u2.name}', '${JSON.stringify(u2.props)}'),
                      ('${s1.elemType}', '${s1.class}', '${s1.name}', '${JSON.stringify(s1.props)}'),
                      ('${a1.elemType}', '${a1.class}', '${a1.name}', '${JSON.stringify(a1.props)}')
         `);
         
  console.log(`successfully add wbsitems to the elements table in ${dbName}`);



  
  // print them out to confirm their contents:
  db.each("SELECT * FROM elements", (err, row) => {
    let item = {
      elemType: row.elemType,
      class: row.class,
      name: row.name,
      properties: row.properties ? JSON.parse(row.properties) : []
    };
      console.log(`type=${item.elemType}, class=${item.class}, name=${item.name}, 
                  properties=${JSON.stringify(item.properties)}, 
                  graphics=${JSON.stringify(item.graphics)}`);

  });

});

db.close();
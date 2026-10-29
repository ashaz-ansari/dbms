RDBMS PRACTICALS 1-24 - INDEX
Subject : Relational Database Management System (CM41201)
College : Government Polytechnic, Pune

--------------------------------------------------------------------
INDEX
--------------------------------------------------------------------
Practical 01 - ER Diagram for a Given Database
Practical 02 - Apply Constraints on a Relation
Practical 03 - Create and Execute Queries Using DDL Commands
Practical 04 - Create and Execute Queries Using DML Commands
Practical 05 - Create and Execute Queries Using DCL and TCL Commands
Practical 06 - Write Queries Using Different Types of Clauses
Practical 07 - Write Queries Using Set, Relational, Arithmetic and
                Logical Operators
Practical 08 - Write Queries Using SQL Functions
Practical 09 - Write Queries Using Different Types of Joins
Practical 10 - Create, Insert, Update and Drop a View
Practical 11 - Create, Alter and Drop a Sequence
Practical 12 - Create Simple and Composite Indexes and Drop Them
Practical 13 - PL/SQL Program Using Conditional Statements
Practical 14 - PL/SQL Program Using FOR LOOP and REVERSE FOR LOOP
Practical 15 - PL/SQL Program Using WHILE LOOP
Practical 16 - PL/SQL Program Using GOTO, EXIT and CONTINUE
Practical 17 - PL/SQL Program Using Predefined Exceptions
Practical 18 - PL/SQL Program Using User-Defined Exception
Practical 19 - Implement Implicit and Explicit Cursors
Practical 20 - Implement a Stored Procedure
Practical 21 - Implement a Function in PL/SQL
Practical 22 - Create and Delete a Trigger
Practical 23 - Install MongoDB
Practical 24 - Perform Basic MongoDB CRUD Operations

--------------------------------------------------------------------
TABLES USED ACROSS THE PRACTICALS
--------------------------------------------------------------------
Student   - Practical 2  (constraints)
Employee  - Practical 3  (DDL)
Student2  - Practical 4  (DML)
TestData  - Practical 5  (DCL and TCL)
Student3  - Practical 6  (clauses, and also used in 7, 8, 10, 12)
Department, Employee2 - Practical 9 (joins)
Cust2     - Practical 19 (cursors, and also used in 20, 21, 22)

Create Student3 in Practical 6 before running the queries of
Practical 7, 8, 10 and 12. Create Cust2 as shown in Practical 19
before running Practical 20, 21 and 22.

--------------------------------------------------------------------
IMPORTANT EXECUTION NOTES
--------------------------------------------------------------------
1. For Oracle PL/SQL blocks in the SQL Commands interface, execute
   the block without a trailing slash (/). Run table creation,
   procedure creation and procedure calls separately when needed.

2. Enable or inspect DBMS_OUTPUT if you need to view PL/SQL output.
   In SQL*Plus:
     SET SERVEROUTPUT ON;
   In the web based SQL Commands interface, use the DBMS Output tab
   and enable it.

3. Every PL/SQL block must end with END; followed by a slash (/) on
   its own line when run from SQL*Plus.

4. The GRANT and REVOKE commands of Practical 5 require administrator
   privileges and a valid existing username.

5. For Practical 23, remember that Compass alone cannot run the local
   database server; MongoDB Community Server must also be running.

6. For Practical 24, the MongoDB shell commands can be run in
   mongosh; in Compass, use the graphical interface or its supported
   query tools.

7. Quotes in Oracle are single quotes ('text'). Double quotes are
   used only for identifiers such as column aliases.

8. SQL statements are not case sensitive, but string values compared
   in a WHERE clause are case sensitive.

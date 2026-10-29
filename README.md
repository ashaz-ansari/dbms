# RDBMS Practicals 1-24

Practical write-ups for **Relational Database Management System (CM41201)**,
Government Polytechnic, Pune. Each file holds the aim, theory, SQL or PL/SQL
code, procedure, observation and conclusion in plain text.

## Read them with npx

No install needed:

```sh
# list every practical with its title
npx --yes github:ashaz-ansari/dbms

# print one practical
npx --yes github:ashaz-ansari/dbms 3

# print a few
npx --yes github:ashaz-ansari/dbms 3 5 9

# print all 24
npx --yes github:ashaz-ansari/dbms all

# print the index, with the tables shared between practicals
npx --yes github:ashaz-ansari/dbms --index

# save as .txt files instead of printing
npx --yes github:ashaz-ansari/dbms 3 --save
npx --yes github:ashaz-ansari/dbms all --save --dir ./out
```

`node cli.js <same arguments>` works if you have cloned the repo.

## Contents

| # | Practical |
|---|-----------|
| 1 | ER Diagram for a Given Database |
| 2 | Apply Constraints on a Relation |
| 3 | Create and Execute Queries Using DDL Commands |
| 4 | Create and Execute Queries Using DML Commands |
| 5 | Create and Execute Queries Using DCL and TCL Commands |
| 6 | Write Queries Using Different Types of Clauses |
| 7 | Write Queries Using Set, Relational, Arithmetic and Logical Operators |
| 8 | Write Queries Using SQL Functions |
| 9 | Write Queries Using Different Types of Joins |
| 10 | Create, Insert, Update and Drop a View |
| 11 | Create, Alter and Drop a Sequence |
| 12 | Create Simple and Composite Indexes and Drop Them |
| 13 | PL/SQL Program Using Conditional Statements |
| 14 | PL/SQL Program Using FOR LOOP and REVERSE FOR LOOP |
| 15 | PL/SQL Program Using WHILE LOOP |
| 16 | PL/SQL Program Using GOTO, EXIT and CONTINUE |
| 17 | PL/SQL Program Using Predefined Exceptions |
| 18 | PL/SQL Program Using User-Defined Exception |
| 19 | Implement Implicit and Explicit Cursors |
| 20 | Implement a Stored Procedure |
| 21 | Implement a Function in PL/SQL |
| 22 | Create and Delete a Trigger |
| 23 | Install MongoDB |
| 24 | Perform Basic MongoDB CRUD Operations |

Tables are shared between practicals: create `Student3` (practical 6) before
practicals 7, 8, 10 and 12, and `Cust2` (practical 19) before practicals 20,
21 and 22. See `practical/README-Index.txt` for the execution notes.

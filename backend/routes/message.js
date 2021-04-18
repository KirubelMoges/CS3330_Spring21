//GET
// api/messages
//As the manager get list of messages that have been previously sent
app.get('/api/messages', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let sql = 'SELECT u.firstname, u.lastname, i.subject, i.message FROM inbox i LEFT JOIN users u ON i.senderId = u.userId';
        let crypto;
        try {
          crypto = await import('crypto');
        } catch (err) {
          console.log('crypto support is disabled!');
        }

        connection.query(sql, function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
});

//GET
// api/allMessages
//As a signed in employee, I want to get list of messages that have been previously sent
app.get('/api/allMessages', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let sql = 'SELECT u.firstname, u.lastname, i.subject, i.message FROM inbox i LEFT JOIN users u ON i.senderId = u.userId';
        let crypto;
        try {
          crypto = await import('crypto');
        } catch (err) {
          console.log('crypto support is disabled!');
        }

        connection.query(sql, function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
});


//GET
//api/employeeMessages
//As an employee I want to see the messages that have been sent to me
app.get('/api/EmployeeMessages', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection){
    if(err){
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection',err)
      res.status(400).send('Problem obtaining MySQL connection'); 
    } else {
      let recipientID = req.body["recipientID"];
      let sql = 'SELECT u.firstname, u.lastname, i.subject, i.message FROM inbox i LEFT JOIN users u ON i.senderId = u.userId WHERE i.recipientID = ?';
      let crypto;
      try {
        crypto = await import('crypto');
      } catch (err) {
        console.log('crypto support is disabled!');
      }
      connection.query(sql, recipientID, function (err, rows, fields) {
        connection.release();
        if (err) {
          logger.error("Error while fetching values: \n", err);
          res.status(400).json({
            "data": [],
            "error": "Error obtaining values"
          })
        } else {
          res.status(200).json({
            "data": rows
          });
        }
      });
    }
  });
});

//GET
//api/searchMessages
//I want to see the messages that contain a certain keyword
app.get('/api/searchMessages', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection){
    if(err){
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection',err)
      res.status(400).send('Problem obtaining MySQL connection'); 
    } else {
      let keyword = req.body["keyword"];
      let search = '%' + keyword + '%';
      let sql = 'SELECT u.firstname, u.lastname, i.subject, i.message FROM inbox i LEFT JOIN users u ON i.senderId = u.userId WHERE i.message LIKE ?'
      let crypto;
      try {
        crypto = await import('crypto');
      } catch (err) {
        console.log('crypto support is disabled!');
      }
      connection.query(sql, search, function (err, rows, fields) {
        connection.release();
        if (err) {
          logger.error("Error while fetching values: \n", err);
          res.status(400).json({
            "data": [],
            "error": "Error obtaining values"
          })
        } else {
          res.status(200).json({
            "data": rows
          });
        }
      });
    }
  });
});


//POST
//Office manager wants to post a message to a tagged employee
// api/postMessage
app.post('/api/postMessage', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let senderId = req.body["senderID"];
        let recipientID = req.body["recipientID"];
        let subject = req.body["subject"];
        let sendDate = req.body["sendDate"];
        let message = req.body["message"];
        
        let values = [
          [senderId, recipientID, subject, sendDate, message]
        ];
        let sql = "INSERT INTO inbox(senderId, recipientId, subject, sendDate, message) VALUES ?";
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(sql, values, function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
});




  
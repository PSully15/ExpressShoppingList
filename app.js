const express = require('express');
const morgan = require('morgan');
const ExpressError = require('./expressError');
const itemRoutes = require('./routes/items');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/items', itemRoutes);

// 404 handler
app.use((req, res, next) => {
	const e = new ExpressError('Page Not Found', 404);
	next(e);
});

// general error handler
app.use((err, req, res, next) => {
	// the default status is 500 Internal Server Error
	let status = err.status || 500;
	let message = err.msg;

	// set the status and alert the user
	return res.status(status).json({
		error: {
			message: message,
			status: status,
		},
	});
});

module.exports = app;

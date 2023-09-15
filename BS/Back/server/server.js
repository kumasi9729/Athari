const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const keyfile = path.join(__dirname, 'prefab-botany-398818-4371f263e5b4.json'); // Ensure this path is correct
const credentials = require(keyfile);

const drive = google.drive('v3');
const jwtClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/drive'],
    null
);

jwtClient.authorize(authErr => {
    if (authErr) {
        console.error('Error during JWT auth:', authErr);
        process.exit(1); // Exit process if there's an auth error
    }
});

// Setting up multer to store uploaded files temporarily on disk
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')  // Ensure you have an "uploads" directory in your project root
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            console.log("No file provided.");
            return res.status(400).send('No file uploaded.');
        }

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path) // Read the file as a stream
        };

        // Drive Upload
        let uploadedFile;
        try {
            uploadedFile = await drive.files.create({
                resource: {
                    name: req.file.originalname,
                    parents: ['1nxff5aHjFX80r2F1bBODTuzxpjVDhR-g'],  // replace 'your_drive_folder_id' with your actual folder ID
                },
                media,
                auth: jwtClient
            });
        } catch (err) {
            console.error('Error uploading to Drive:', err);
            return res.status(500).send('Failed to upload to Google Drive.');
        }

        // Execute Python script
        exec(`python3 ${__dirname}/scrape_pdf.py ${req.file.path}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Exec error while processing the file: ${error}`);
                return res.status(500).send('Error processing the file.');
            }

            let result;
            try {
                result = JSON.parse(stdout);
            } catch (parseError) {
                console.error(`Error parsing Python output: ${parseError}`);
                return res.status(500).send('Error parsing extracted data.');
            }

            const extractedData = result.data;
            const dataFilePath = path.join(__dirname, result.filename);

            // Clean up: Delete the temporary uploaded PDF file
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting the uploaded PDF file:', unlinkErr);
                }
            });

            // Upload extracted data to Drive
            const fileStreamForData = fs.createReadStream(dataFilePath);
            drive.files.create({
                resource: {
                    name: result.filename,
                    parents: ['1nxff5aHjFX80r2F1bBODTuzxpjVDhR-g'],  // replace with your actual folder ID for extracted data
                },
                media: {
                    mimeType: 'text/plain',
                    body: fileStreamForData
                },
                auth: jwtClient
            }, (dataErr, dataFile) => {
                if (dataErr) {
                    console.error('Error uploading data to Drive:', dataErr);
                    return res.status(500).send('Failed to upload extracted data to Google Drive.');
                }

                // Clean up: Delete the .txt file from the server after upload
                fs.unlink(dataFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting the data file:', unlinkErr);
                    }
                });

                res.status(200).send('Successfully uploaded PDF and extracted data to Google Drive.');
            });
        });

    } catch (err) {
        console.error('Unknown error in /upload:', err);
        res.status(500).send('Unknown error.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

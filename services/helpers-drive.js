import fs from "fs";

//promesa para crear una nueva carpeta en drive
export const createFolder = async (folderName, drive) => {
  try {
    const response = await drive.files.create({
      resource: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });

    return response.data.id;
  } catch (error) {
    console.error("Error al crear la carpeta:", error.message);
    throw error;
  }
};

export const shareFolderWithPersonalAccount = async (
  folderId,
  personalAccountEmail,
  drive,
  permiso
) => {
  const permission = {
    type: "user",
    role: permiso, // Puedes ajustar el rol según tus necesidades (reader, writer, owner, etc.)
    emailAddress: personalAccountEmail,
  };

  try {
    await drive.permissions.create({
      fileId: folderId,
      requestBody: permission,
      fields: "id",
    });

    console.log(`Carpeta compartida con éxito con ${personalAccountEmail}.`);
  } catch (error) {
    console.error("Error al compartir la carpeta:", error.message);
    throw error;
  }
};


export const sendFileToDrive = (files_pdf, myFolder, drive) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { originalFilename: pdfName, filepath: pdfPath } = files_pdf;

      const fileMetadata = {
        name: pdfName,
        parents: [myFolder],
        mimeType: "application/pdf",
      };

      const response = await drive.files.create({
        resource: fileMetadata,
        media: {
          mimeType: "application/pdf",
          body: fs.createReadStream(pdfPath),
        },
        fields: "id",
      });

      // Eliminar el archivo temporal después de subirlo a Drive
      fs.unlinkSync(pdfPath);

      console.log("Archivo PDF subido. ID:", response.data.id);
      resolve(response.data.id);
    } catch (error) {
      console.error("Error al subir el archivo:", error.message);
      reject(error);
    }
  });
};

export const getIdByUrl = (url) => {
  const match = url.match(/\/file\/d\/([^/]+)\//);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export const deleteFile = (fileId, drive) => {
  return new Promise(async (resolve, reject) => {
    try {
      await drive.files.delete({
        fileId: fileId,
      });
      console.log(`Archivo con ID ${fileId} eliminado correctamente.`);
      resolve(true); // El archivo se eliminó con éxito
    } catch (error) {
      console.error(`Error al eliminar el archivo con ID ${fileId}:`, error.message);
      reject(false); // Error al eliminar el archivo
    }
  });
};

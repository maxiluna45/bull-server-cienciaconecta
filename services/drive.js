import { google } from "googleapis";

//credenciales de la cuenta de servicio
const credentials = {
  "type": "service_account",
  "project_id": "cienciaconecta",
  "private_key_id": "f10c6dd7c6a4bb5d46bdbbb81055d13fe42ce872",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC04OZEc54FTUI2\nhdP9A+CRFTUNf9Ei/3aEpF0oHkCe7x93UnkQyYdZEq+QtYXaMLvt6eC4GbRNfIIz\nXvoAJZrdwVegDDZlBnOKIh0EQx/p0JB7sDCgxewsBO1Bx4Yqm8IXxF+fbfizvrAn\nU0Vm2yN1BtF9WgsowhZd+C7NBBWBLv0dNCELx5flOpJRe3tyYuyEeU14C9kjaDF9\nDJGwT9LS7UdSV3TwYmF5nPt7qst7Dkl8dFHGviYV5Gmp2iQf/VhnRtGQZMq1EcGE\n9ZTE+yTsa0LgE0gG7sDVXKLOvMhyWyd9veKF6+BQLVCkkAoe3Y/amc+jTHKP3xE6\nM3TgBKrBAgMBAAECggEACLAZvbvcISiQFg+kOkdFDASImkSjdLeJ1FhGhWgIlhAc\n9ic1Tr/DTl1PpspId6dQfrgb9cCXg+l6u049tCNnECCag+k6QdMT8+4foyxsAr5k\neWoIN+l+mctFyYHnv5gTwOT+UjY4lFedkFH9wVfXjBllZAyezX8fDs+EkSirG/VW\ncZg1VaTmAY1LyHEmEH6qr7Ft18lX5Pc7N1wKBHmbs7aK+V/3cmOsKNnCSfN+UZdW\nankhZqp5IctG+LGUQNvCIdoE3DlvT5no5B1/6TqnRJ1kyWe7o4XL44HgIdeEONWK\nodgs8aknxocFspxPFMCc7qoGKmlI8Tu/KL3JAwY6TQKBgQDz+GcM7cLFLZJ94EBH\nLR7FYzvVGsrpGfjK4ZEaisHMved/Sl7ZtDMKVBIhYZejaGpDm9yEpGSdC6Clbv3S\naSOojCTrYJHBKSPrzrGL8umMIoSjJIZymFR3W3Wboi9D3dHUq7gtRxN4wnMLa0pX\nMJ0ZpAvAYCPIzShBp2s7Yy7DfQKBgQC9zBlvyG3qcKKNC3Ip0AqUgfBTelc+H+17\nIGEx9DVik2YF2Ff7pVQyeJo/aX6aGrpe3ur/zeIeCfeVcAwfWsPDK4GT1U9FZi0X\nHajUvdZ/eHobez6chjAwZSe7OAQGKPAUsWsX2oSzlgoMbGWbjYL/1W59olzAcNUj\nPepfcP/flQKBgQCH1N1LDXVLYrwU6S3gcvaW31EIrQocDiG+kye+p1KPM4wYCsgU\nXYetUHFntHZAvHmterGkCAMcjMS8Vrdq1q7LwHstsW51JPqi50liqbPuGanPSx6v\n3q/oZDtukzXNi0qwJYs9aj0lFt4GlY2mTaKqC/Oe/+fsfIzVQOkq/2Wh4QKBgHIZ\nDnmavikfyTiNVvY38QRSEQ2+EFBylStdzdBgBO/buItvAYVwYGtvARt56ffudXeu\n/wsE1BhG2aXmlAMNZ34e22jp5RvNTvIEjIhID3jWDmIS9xLVwIZ3aSkthY3Gcn2e\nIslWPkxPuH67c2HN8qClyCSSxLuTmS30fL8fiVL5AoGBALc3uDmv/IMy6UBJZ0Aq\n1IxpFyKJ6Wrq+7xglSwTGIr7DpfUKVK70CqBxToduGjF+yuELJj2Wgmp+BQB+tvu\nEZ29Pzt2Vz9SThqJ62KzP2hKQCuxTXKEisXMecA2czmwI62oQPdXsi20M/YiCxSd\nC9zPKQLc+UJdMycKYHPUIn1d\n-----END PRIVATE KEY-----\n",
  "client_email": "drivetest@cienciaconecta.iam.gserviceaccount.com",
  "client_id": "110032282842750894246",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/drivetest%40cienciaconecta.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

//servicio de googleapis que utilizaré
const SCOPES = ["https://www.googleapis.com/auth/drive"];


// Crear la autenticación y configurar el cliente de Google Drive
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

//instancia de drive creada
export const drive = google.drive({ version: "v3", auth });

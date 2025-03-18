import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

export const withMulter = (handler: any) => (req: NextApiRequest, res: NextApiResponse) => {
  upload.single('file')(req as any, res as any, (err: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return handler(req, res);
  });
};

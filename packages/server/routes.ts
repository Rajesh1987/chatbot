import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controller/chat.controller';

import { PrismaClient } from "@prisma/client";

//import { PrismaClient } from "./generated/prisma";


   



const router = express.Router();


router.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, World!' });
});

router.post('/api/chat', chatController.handleChatRequest); 

// router.get('/api/products/:id/reviews', async(req: Request, res: Response) => {

//    const prisma = new PrismaClient();
//      await prisma.$connect();
//       console.log("Connected ------->>>>>>> ");
//    const productId = Number(req.params.id);

//    const reviews = await prisma.review.findMany({ 
//       where: { productId },
//       orderBy: { createdAt: 'desc' } 
//    });
//    res.json(reviews);

// })
   
export default router;   
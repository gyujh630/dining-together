import { Request, Response } from 'express';
import {
  Reservation,
  createReservation,
  getReservationsByUserId,
  updateReservationById,
  getReservationsByStoreId,
  getAllReservations,
  getReservationById,
} from '../models/ReservationModel';
import { getStoreById, getUserById } from '../models';
// import Place, { getPlaceById } from '../models/PlaceModel';

// // 예약하기 - 예약 가능 공간 조회
// export async function getAvailablePlaces(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   try {
//     const { storeId, reservedDate, people } = req.body;
//     const store = await getStoreById(storeId);
//     if (!store || store.isDeleted) {
//       res.status(404).json({ error: 'Store not found' });
//     } else if (people > store.maxNum || people <= 0) {
//       res.status(400).json({ error: 'invalid data' });
//     } else {
//       const availablePlaces = await findAvailablePlaces(
//         storeId,
//         reservedDate,
//         people
//       );

//       if (availablePlaces.length === 0) {
//         res.status(404).json({ error: 'No available places found' });
//       } else {
//         res.status(200).json(availablePlaces);
//       }
//     }
//   } catch (error: any) {
//     res.status(500).json({ error: 'Failed to get available place list' });
//   }
// }

// 예약 생성
export async function createReservationHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { userId, placeId } = req.body;
    const user = await getUserById(userId);
    // const place = await getPlaceById(placeId);

    if (!user || user.isDeleted) {
      res.status(404).json({ error: 'User not found' });
      // } else if (!place) {
      //   //isDeleted 추가해야함.
      //   res.status(404).json({ error: 'Place not found' });
    } else {
      const newReservation: Reservation = req.body;
      const reservedId = await createReservation(newReservation);
      res.status(201).json({ reservedId });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
}

// 특정 예약조회
export async function getReservationByIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reservedId: number = parseInt(req.params.reservedId, 10);
    const reservation = await getReservationById(reservedId);
    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch reservation by ID' });
  }
}

// 회원의 예약목록조회
export async function getReservationsByUserIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      const reservations = await getReservationsByUserId(userId);
      res.status(200).json(reservations);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
}

// 가게의 예약목록 조회
export async function getReservationsByStoreIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const store = await getStoreById(storeId);
    if (!store) {
      res.status(404).send('Store not found');
    } else {
      const reservations = await getReservationsByStoreId(storeId);
      res.status(200).json(reservations);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch reservations by storeId' });
  }
}

// 전체 예약목록 조회
export async function getAllReservationsHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reservations = await getAllReservations();
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch all reservations' });
  }
}

// 예약 수정
export async function updateReservationHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reservedId: number = parseInt(req.params.reservedId, 10);
    const reserve = await getReservationById(reservedId);
    if (!reserve) {
      res.status(404).json({ error: 'Reservation not found' });
    } else {
      const updatedData: Reservation = req.body;
      await updateReservationById(reservedId, updatedData);
      res.status(200).json({ message: 'Reservation updated successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
}

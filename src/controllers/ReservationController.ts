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

// 예약 생성
export async function createReservationHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const newReservation: Reservation = req.body;
    const reservedId = await createReservation(newReservation);
    res.status(201).json({ reservedId });
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
    const reservation = await getReservationById(Number(reservedId));
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
    const reservedId: number = parseInt(req.params.reservationId, 10);
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

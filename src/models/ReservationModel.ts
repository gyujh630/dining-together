import pool from '../config/dbConfig';
import Place from './PlaceModel';
import { getStoreById } from './StoreModel';
export interface Reservation {
  reservedId: number;
  userId: number;
  storeId: number;
  placeId: number;
  createdAt: string;
  modifiedAt: string;
  people: number;
  reservedDate: Date;
  visitTime: string;
  status: string;
}

//예약 생성
export async function createReservation(
  newReservation: Reservation
): Promise<number> {
  try {
    const createReservationQuery = `
      INSERT INTO RESERVATION (userId, storeId, placeId, people, reservedDate, visitTime)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(createReservationQuery, [
      newReservation.userId,
      newReservation.storeId,
      newReservation.placeId,
      newReservation.people,
      newReservation.reservedDate,
      newReservation.visitTime,
    ]);

    return (result as any).insertId as number;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating reservation');
  }
}

// 특정 예약조회
export async function getReservationById(
  reservedId: number
): Promise<Reservation | null> {
  const getReservationByIdQuery = `
    SELECT reservedId, userId, storeId, placeId, people, DATE_FORMAT(reservedDate, '%y-%m-%d') as reservedDate, visitTime, status
    FROM RESERVATION
    WHERE reservedId = ?
  `;

  try {
    const [results] = await pool.query(getReservationByIdQuery, [reservedId]);
    if (Array.isArray(results) && results.length > 0) {
      return results[0] as Reservation;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching reservation by ID');
  }
}

// 회원의 예약목록조회
export async function getReservationsByUserId(
  userId: number
): Promise<Reservation[]> {
  const getReservationsQuery = `
    SELECT reservedId, userId, storeId, placeId, people, DATE_FORMAT(reservedDate, '%y-%m-%d') as reservedDate, visitTime, status
    FROM RESERVATION
    WHERE userId = ?
  `;

  try {
    const [results] = await pool.query(getReservationsQuery, [userId]);
    return results as Reservation[];
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching reservations');
  }
}

// 가게의 예약목록조회
export async function getReservationsByStoreId(
  storeId: number
): Promise<Reservation[]> {
  const getReservationsQuery = `
    SELECT reservedId, userId, storeId, placeId, people, DATE_FORMAT(reservedDate, '%y-%m-%d') as reservedDate, visitTime, status
    FROM RESERVATION
    WHERE storeId = ?
  `;

  try {
    const [results] = await pool.query(getReservationsQuery, [storeId]);
    return results as Reservation[];
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching reservations by storeId');
  }
}

// 전체 예약목록조회
export async function getAllReservations(): Promise<Reservation[]> {
  const getAllReservationsQuery = `SELECT reservedId, userId, storeId, placeId, people, DATE_FORMAT(reservedDate, '%y-%m-%d') as reservedDate, visitTime, status
    FROM RESERVATION`;

  try {
    const [results] = await pool.query(getAllReservationsQuery);
    return results as Reservation[];
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching all reservations');
  }
}

// 예약 수정
export async function updateReservationById(
  reservedId: number,
  updatedData: Reservation
): Promise<void> {
  const updateFields = Object.entries(updatedData)
    .filter(([key, value]) => value !== undefined)
    .map(([key]) => `${key} = ?`)
    .join(', ');

  if (!updateFields) {
    throw new Error('No fields to update');
  }

  const values = Object.values(updatedData).filter(
    (value) => value !== undefined
  );
  values.push(reservedId);

  const updateReservationQuery = `
    UPDATE RESERVATION
    SET ${updateFields}
    WHERE reservedId = ?
  `;

  try {
    await pool.query(updateReservationQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Error updating reservation');
  }
}

// 예약 가능여부 확인
export async function isAvailableReservation(
  placeId: number,
  date: string
): Promise<boolean> {
  try {
    const query = `
      SELECT COUNT(*) AS reservationCount
      FROM RESERVATION
      WHERE placeId = ? AND reservedDate = ? AND (status <> '예약취소');
    `;

    const [rows]: any = await pool.query(query, [placeId, date]);

    const reservationCount = rows[0].reservationCount;

    if (reservationCount === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error checking available reservation');
  }
}

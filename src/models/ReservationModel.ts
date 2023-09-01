import pool from '../config/dbConfig';
import { stringToDate, toKoreaTime } from '../utils/string-util';
import { RowDataPacket, FieldPacket } from 'mysql2/promise';
import { getStoreById } from './StoreModel';
export interface Reservation extends RowDataPacket {
  reservedId: number;
  userId: number;
  storeId: number;
  placeId: number;
  createdAt: string;
  modifiedAt: string;
  people: number;
  reservedDate: string;
  visitTime: string;
  status: string;
}
interface IFoods extends Array<Reservation> {}

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

    const store = await getStoreById(newReservation.storeId);

    const storeName = store?.storeName;
    const people = newReservation.people;
    const reservedDate = newReservation.reservedDate;
    const visitTime = newReservation.visitTime;
    return {
      storeName,
      people,
      reservedDate,
      visitTime,
    } as any;
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
    SELECT
    R.reservedId,
    R.userId,
    R.storeId,
    R.placeId,
    R.people,
    DATE_FORMAT(R.reservedDate, '%y-%m-%d') as reservedDate,
    R.visitTime,
    R.status,
    S.storeName,
    S.location,
    S.foodCategory,
    SI.imageUrl,
    P.placeName,
    P.placeType
    FROM
    RESERVATION R
    JOIN
    STORE S ON R.storeId = S.storeId
    JOIN
    PLACE P ON R.placeId = P.placeId
    LEFT JOIN
    STOREIMAGE SI ON R.storeId = SI.storeId
    WHERE R.reservedId = ?
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
export async function getReservationsByUserId(userId: number): Promise<any> {
  const getReservationsQuery = `
    SELECT
    R.reservedId,
    R.userId,
    R.storeId,
    R.placeId,
    R.people,
    DATE_FORMAT(R.reservedDate, '%y-%m-%d') as reservedDate,
    R.visitTime,
    R.status,
    S.storeName,
    S.location,
    S.foodCategory,
    SI.imageUrl,
    P.placeName,
    P.placeType
    FROM
    RESERVATION R
    JOIN
    STORE S ON R.storeId = S.storeId
    JOIN
    PLACE P ON R.placeId = P.placeId
    LEFT JOIN (
        SELECT storeId, MIN(imageUrl) as imageUrl
        FROM STOREIMAGE
        GROUP BY storeId
        ) SI ON S.storeId = SI.storeId  
    WHERE R.userId = ?
  `;

  try {
    const [reservations]: [Reservation[], FieldPacket[]] = await pool.query(
      getReservationsQuery,
      [userId]
    );
    const offset = 1000 * 60 * 60 * 9;
    const oneDayOffSet = 1000 * 60 * 60 * 24;
    const koreaNow = new Date(new Date().getTime() + offset);

    const resultsByStatus = {
      예약대기: [] as RowDataPacket,
      방문예정: [] as RowDataPacket,
      방문완료: [] as RowDataPacket,
      예약취소: [] as RowDataPacket,
    };
    for (var i = 0; i < reservations.length; i++) {
      const reservation = reservations[i];
      if (reservation.status === '예약대기') {
        resultsByStatus['예약대기'].push(reservation);
      } else if (reservation.status === '예약취소') {
        resultsByStatus['예약취소'].push(reservation);
      } else if (reservation.status === '예약확정') {
        const koreaReservedDate = new Date(
          stringToDate(reservation.reservedDate).getTime() +
            offset +
            oneDayOffSet
        );
        if (koreaNow <= koreaReservedDate) {
          resultsByStatus['방문예정'].push(reservation);
        } else {
          resultsByStatus['방문완료'].push(reservation);
        }
      }
    }
    return resultsByStatus as any;
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
    SELECT
    R.reservedId,
    R.userId,
    R.storeId,
    R.placeId,
    R.people,
    DATE_FORMAT(R.reservedDate, '%y-%m-%d') as reservedDate,
    R.visitTime,
    R.status,
    S.storeName,
    S.location,
    S.foodCategory,
    SI.imageUrl,
    P.placeName,
    P.placeType,
    U.name,
    U.email,
    U.phoneNum
    FROM
    RESERVATION R
    JOIN
    STORE S ON R.storeId = S.storeId
    JOIN
    PLACE P ON R.placeId = P.placeId
    JOIN
    USER U ON R.userId = U.userId
    LEFT JOIN (
        SELECT storeId, MIN(imageUrl) as imageUrl
        FROM STOREIMAGE
        GROUP BY storeId
        ) SI ON S.storeId = SI.storeId  
    WHERE
    R.storeId = ?;
  `;

  try {
    const [reservations]: [Reservation[], FieldPacket[]] = await pool.query(
      getReservationsQuery,
      [storeId]
    );
    const offset = 1000 * 60 * 60 * 9;
    const oneDayOffSet = 1000 * 60 * 60 * 24;
    const koreaNow = new Date(new Date().getTime() + offset);

    const resultsByStatus = {
      예약대기: [] as RowDataPacket,
      방문예정: [] as RowDataPacket,
      방문완료: [] as RowDataPacket,
      예약취소: [] as RowDataPacket,
    };
    for (var i = 0; i < reservations.length; i++) {
      const reservation = reservations[i];
      if (reservation.status === '예약대기') {
        resultsByStatus['예약대기'].push(reservation);
      } else if (reservation.status === '예약취소') {
        resultsByStatus['예약취소'].push(reservation);
      } else if (reservation.status === '예약확정') {
        const koreaReservedDate = new Date(
          stringToDate(reservation.reservedDate).getTime() +
            offset +
            oneDayOffSet
        );
        if (koreaNow <= koreaReservedDate) {
          resultsByStatus['방문예정'].push(reservation);
        } else {
          resultsByStatus['방문완료'].push(reservation);
        }
      }
    }
    return resultsByStatus as any;
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

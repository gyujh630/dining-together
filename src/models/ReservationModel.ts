import pool from '../config/dbConfig';

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

export async function createReservation(
  newReservation: Reservation
): Promise<number> {
  const findStoreIdQuery = `
    SELECT storeId 
    FROM PLACE
    WHERE placeId = ?
  `;

  try {
    // placeId를 사용하여 storeId를 찾기
    const [storeResult]: any = await pool.query(findStoreIdQuery, [
      newReservation.placeId,
    ]);

    if (storeResult.length === 0) {
      throw new Error('공간이 등록된 가게가 존재하지 않습니다.');
    } else if (storeResult[0].isDeleted) {
      throw new Error('삭제된 가게의 공간입니다.');
    } else {
      const storeId = storeResult[0].storeId;
      const createReservationQuery = `
      INSERT INTO RESERVATION (userId, storeId, placeId, people, reservedDate, visitTime)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
      const [result] = await pool.query(createReservationQuery, [
        newReservation.userId,
        storeId,
        newReservation.placeId,
        newReservation.people,
        newReservation.reservedDate,
        newReservation.visitTime,
      ]);

      return (result as any).insertId as number;
    }
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
  const updateReservationQuery = `
    UPDATE RESERVATION
    SET
      people = ?,
      reservedDate = ?,
      visitTime = ?,
      status = ?
    WHERE reservedId = ?
  `;

  try {
    await pool.query(updateReservationQuery, [
      updatedData.people,
      updatedData.reservedDate,
      updatedData.visitTime,
      updatedData.status,
      reservedId,
    ]);
  } catch (error) {
    console.error(error);
    throw new Error('Error updating reservation');
  }
}

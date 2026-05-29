import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FOODS } from "@/lib/foods";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, food_id as foodId, food_name as foodName, servings,
              calories, protein, carbs, fat, logged_at as loggedAt
       FROM log_entries
       WHERE date(logged_at) = date('now')
       ORDER BY logged_at ASC`
    )
    .all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { foodId, servings = 1 } = await req.json();

  const food = FOODS.find((f) => f.id === foodId);
  if (!food) {
    return NextResponse.json({ error: "Food not found" }, { status: 404 });
  }

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO log_entries (food_id, food_name, servings, calories, protein, carbs, fat)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      food.id,
      food.name,
      servings,
      food.calories * servings,
      food.protein * servings,
      food.carbs * servings,
      food.fat * servings
    );

  const newEntry = db
    .prepare(
      `SELECT id, food_id as foodId, food_name as foodName, servings,
              calories, protein, carbs, fat, logged_at as loggedAt
       FROM log_entries WHERE id = ?`
    )
    .get(result.lastInsertRowid);

  return NextResponse.json(newEntry, { status: 201 });
}

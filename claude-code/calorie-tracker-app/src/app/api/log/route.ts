import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FOODS } from "@/lib/foods";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, food_id as foodId, food_name as foodName, servings,
              calories, protein, carbs, fat, logged_at as loggedAt,
              meal_category as mealCategory
       FROM log_entries
       WHERE date(logged_at) = date('now')
       ORDER BY
         CASE meal_category
           WHEN 'breakfast' THEN 1
           WHEN 'lunch' THEN 2
           WHEN 'dinner' THEN 3
           WHEN 'snack' THEN 4
           ELSE 5 END,
         logged_at ASC`
    )
    .all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();

  const mealCategory = ['breakfast', 'lunch', 'dinner', 'snack'].includes(body.mealCategory)
    ? body.mealCategory
    : 'snack';

  let foodId: string;
  let foodName: string;
  let servings: number;
  let calories: number;
  let protein: number;
  let carbs: number;
  let fat: number;

  if (body.foodId) {
    const food = FOODS.find((f) => f.id === body.foodId);
    if (!food) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }
    servings = body.servings ?? 1;
    foodId = food.id;
    foodName = food.name;
    calories = food.calories * servings;
    protein = food.protein * servings;
    carbs = food.carbs * servings;
    fat = food.fat * servings;
  } else {
    if (!body.foodName) {
      return NextResponse.json({ error: "foodId or foodName is required" }, { status: 400 });
    }
    foodId = "ai-custom";
    foodName = body.foodName;
    servings = 1;
    calories = body.calories ?? 0;
    protein = body.protein ?? 0;
    carbs = body.carbs ?? 0;
    fat = body.fat ?? 0;
  }

  const result = db
    .prepare(
      `INSERT INTO log_entries (food_id, food_name, servings, calories, protein, carbs, fat, meal_category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(foodId, foodName, servings, calories, protein, carbs, fat, mealCategory);

  const newEntry = db
    .prepare(
      `SELECT id, food_id as foodId, food_name as foodName, servings,
              calories, protein, carbs, fat, logged_at as loggedAt,
              meal_category as mealCategory
       FROM log_entries WHERE id = ?`
    )
    .get(result.lastInsertRowid);

  return NextResponse.json(newEntry, { status: 201 });
}

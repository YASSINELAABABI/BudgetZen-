<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $expenses = Expense::where('user_id', $request->user()->id)
            ->orderByDesc('date')
            ->get();

        return ExpenseResource::collection($expenses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'category' => ['required', 'string', 'max:100'],
            'date' => ['required', 'date'],
        ]);

        $expense = Expense::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return (new ExpenseResource($expense->refresh()))->response()->setStatusCode(201);
    }

    public function show(Request $request, Expense $expense)
    {
        $this->authorizeExpense($request, $expense);

        return response()->json(['data' => $expense]);
    }

    public function update(Request $request, Expense $expense)
    {
        $this->authorizeExpense($request, $expense);

        $validated = $request->validate([
            'description' => ['sometimes', 'string', 'max:255'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'category' => ['sometimes', 'string', 'max:100'],
            'date' => ['sometimes', 'date'],
        ]);

        $expense->update($validated);

        return new ExpenseResource($expense->refresh());
    }

    public function destroy(Request $request, Expense $expense)
    {
        $this->authorizeExpense($request, $expense);

        $expense->delete();

        return response()->json(['message' => 'Expense removed.']);
    }

    private function authorizeExpense(Request $request, Expense $expense): void
    {
        if ($expense->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to access this expense.');
        }
    }
}

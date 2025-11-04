<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChargeResource;
use App\Models\Charge;
use Illuminate\Http\Request;

class ChargeController extends Controller
{
    public function index(Request $request)
    {
        $charges = Charge::where('user_id', $request->user()->id)
            ->orderByDesc('due_date')
            ->get();

        return ChargeResource::collection($charges);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'category' => ['required', 'string', 'max:100'],
            'due_date' => ['required', 'date'],
            'is_paid' => ['sometimes', 'boolean'],
        ]);

        $charge = Charge::create([
            ...$validated,
            'is_paid' => $validated['is_paid'] ?? false,
            'user_id' => $request->user()->id,
        ]);

        return (new ChargeResource($charge->refresh()))->response()->setStatusCode(201);
    }

    public function show(Request $request, Charge $charge)
    {
        $this->authorizeCharge($request, $charge);

        return response()->json(['data' => $charge]);
    }

    public function update(Request $request, Charge $charge)
    {
        $this->authorizeCharge($request, $charge);

        $validated = $request->validate([
            'description' => ['sometimes', 'string', 'max:255'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'category' => ['sometimes', 'string', 'max:100'],
            'due_date' => ['sometimes', 'date'],
            'is_paid' => ['sometimes', 'boolean'],
        ]);

        $charge->update($validated);

        return new ChargeResource($charge->refresh());
    }

    public function destroy(Request $request, Charge $charge)
    {
        $this->authorizeCharge($request, $charge);

        $charge->delete();

        return response()->json(['message' => 'Charge removed.']);
    }

    private function authorizeCharge(Request $request, Charge $charge): void
    {
        if ($charge->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to access this charge.');
        }
    }
}

import type { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await UserModel.findById(req.auth!.userId)
      .select("name email avatar phone gender dateOfBirth addresses")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, phone, gender, dateOfBirth, avatar } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name || null;
    if (phone !== undefined) updates.phone = phone || null;
    if (gender !== undefined) updates.gender = gender || null;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (avatar !== undefined) updates.avatar = avatar || null;

    const user = await UserModel.findByIdAndUpdate(req.auth!.userId, { $set: updates }, { new: true })
      .select("name email avatar phone gender dateOfBirth addresses")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addAddress(req: AuthRequest, res: Response) {
  try {
    const { label, name, line1, line2, city, state, postalCode, country, phone } = req.body;
    const user = await UserModel.findById(req.auth!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push({ label, name, line1, line2, city, state, postalCode, country, phone });
    await user.save();

    res.status(201).json({ addresses: user.addresses });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateAddress(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { label, name, line1, line2, city, state, postalCode, country, phone } = req.body;

    const user = await UserModel.findById(req.auth!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (label !== undefined) address.label = label;
    if (name !== undefined) address.name = name;
    if (line1 !== undefined) address.line1 = line1;
    if (line2 !== undefined) address.line2 = line2;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (phone !== undefined) address.phone = phone;

    await user.save();
    res.json({ addresses: user.addresses });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteAddress(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(req.auth!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    user.addresses.pull(id);
    await user.save();

    res.json({ addresses: user.addresses });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}

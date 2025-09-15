/* eslint-disable @typescript-eslint/no-explicit-any */
import connectMongoDB from "@/libs/dbConnect";
import User, { userSchemaZod } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/templates/EmailTemplate";
import { validateRequest } from "@/utils/validateRequest";
import { generateToken } from "@/utils/generateToken";
import { formatResponse } from "@/utils/responseFormatter";
import logger from "@/libs/logger";

/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Sign up a new user
 *     description: Create a new user account with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignUpResponse'
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *     SignUpResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

interface SignUpResponse {
	message: string;
	success: boolean;
	data?: {
		user: {
			_id: string;
			email: string;
		};
	};
	errors?: any[];
}

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(
	req: NextRequest
): Promise<NextResponse<SignUpResponse>> {
	try {
		// Validate essential environment variables
		const JWT_SECRET = process.env.JWT_SECRET;
		const RESEND_API_KEY = process.env.RESEND_API_KEY;

		if (!JWT_SECRET) {
			logger.error("JWT_SECRET is not defined in environment variables.");
			return formatResponse(
				{ message: "Internal server error.", success: false },
				500
			);
		}

		if (!RESEND_API_KEY) {
			logger.error("RESEND_API_KEY is not defined in environment variables.");
			return formatResponse(
				{ message: "Internal server error.", success: false },
				500
			);
		}await connectMongoDB();

		// Validate request body using Zod
		const validation = await validateRequest(
			req,
			userSchemaZod.pick({ email: true, password: true })
		);
		if (!validation.success) {
			logger.warn(
				`Validation failed for sign-up: ${JSON.stringify(
					validation.errors?.errors
				)}`
			);
			return formatResponse(
				{
					message: "Invalid input.",
					success: false,
					errors: validation.errors?.errors,
				},
				400
			);
		}

		const { email, password } = validation.data!;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			logger.warn(`User already exists: ${email}`);
			return formatResponse(
				{ message: "User already exists.", success: false },
				409
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create and save the new user
		const newUser = new User({ email, password: hashedPassword });
		await newUser.save();

		// Generate JWT token with expiration
		const token = generateToken(
			{ userId: newUser._id, email: newUser.email },
			JWT_SECRET,
			"1h" // Token expires in 1 hour
		);

		// Send welcome email via Resend
		try {
			await resend.emails.send({
				from: "my-movies@mail.elemensissoftech.com",
				to: [email],
				subject: "Welcome to My Movies",
				react: EmailTemplate({ email: email }),
			});
			logger.info(`Welcome email sent to: ${email}`);
		} catch (emailError) {
			logger.error(`Failed to send welcome email to ${email}: ${emailError}`);
			// Optionally, you can decide whether to fail the sign-up process if email fails
			// For now, we'll proceed without failing
		}

		// Set JWT token in HttpOnly cookie for security
		const response = formatResponse(
			{
				message: "User created successfully.",
				success: true,
				data: { user: { _id: newUser._id, email: newUser.email } },
			},
			200
		);

		response.cookies.set({
			name: "token",
			value: token,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60, // 1 hour in seconds
		});

		logger.info(`User registered successfully: ${email}`);
		return response;
	} catch (error) {
		logger.error("Sign-Up Error:", error);
		return formatResponse(
			{ message: "Internal server error.", success: false },
			500
		);
	}
}

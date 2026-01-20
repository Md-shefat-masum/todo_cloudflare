import { createPrismaClient } from './prisma.js';
import { handleUserRoutes } from './routes/userRoutes.js';
import { handleTodoRoutes } from './routes/todoRoutes.js';
import { handleApiRoutes } from './routes/apiRoutes.js';
import { handleAuthRoutes } from './routes/authRoutes.js';
import { handleProjectRoutes } from './routes/projectRoutes.js';
import { handleTaskRoutes } from './routes/taskRoutes.js';

export default {
	async fetch(request, env) {
		// Check if database binding exists
		if (!env.todo_db) {
			return new Response(
				JSON.stringify({ error: 'Database binding not found' }),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}
		
		const prisma = createPrismaClient(env.todo_db);
		
		// CRITICAL: Force access to taskModel immediately after creation
		// This must be done BEFORE any route handlers to ensure it's bundled
		// Access it in a way that can't be optimized away
		try {
			// Force property access - this creates a reference the bundler can't remove
			const _taskModelCheck = 'taskModel' in prisma;
			const _taskModelAccess = prisma['taskModel'];
			const _taskModelDot = prisma.taskModel;
			
			// Store references to force inclusion
			if (_taskModelDot) {
				prisma._ensureTaskModel = _taskModelDot;
			}
		} catch (e) {
			// Ignore - taskModel might not be available yet
		}

		// CORS headers
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// Try to handle routes in order
		// Each route handler returns a Response if matched, or null if not matched

		// 1. General API routes
		const apiResponse = await handleApiRoutes(request, corsHeaders);
		if (apiResponse) return apiResponse;

		// 2. Auth routes
		const authResponse = await handleAuthRoutes(request, prisma, corsHeaders, env);
		if (authResponse) return authResponse;

		// 3. User routes
		const userResponse = await handleUserRoutes(request, prisma, corsHeaders);
		if (userResponse) return userResponse;

		// 4. Project routes
		const projectResponse = await handleProjectRoutes(request, prisma, corsHeaders, env);
		if (projectResponse) return projectResponse;

		// 5. Task routes
		const taskResponse = await handleTaskRoutes(request, prisma, corsHeaders, env);
		if (taskResponse) return taskResponse;

		// 6. Todo routes
		const todoResponse = await handleTodoRoutes(request, prisma, corsHeaders);
		if (todoResponse) return todoResponse;

		// No route matched - return 404
		return new Response(null, { status: 404, headers: corsHeaders });
	},
};

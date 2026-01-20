import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

/**
 * Creates a Prisma client instance for Cloudflare D1
 * @param {D1Database} d1 - The D1 database binding from Cloudflare Workers
 * @returns {PrismaClient} Prisma client instance
 */
export function createPrismaClient(d1) {
	if (!d1) {
		console.error('D1 database binding is undefined');
		throw new Error('D1 database binding is required');
	}
	try {
		const adapter = new PrismaD1(d1);
		const prisma = new PrismaClient({ adapter });
		
		// CRITICAL: Force immediate access and method call on taskModel to prevent tree-shaking
		// Accessing properties AND methods ensures the bundler includes the entire model
		// This ensures TaskModel is included in the Cloudflare Workers bundle
		
		// Access taskModel and its methods immediately - this is critical for bundling
		const taskModelRef = prisma.taskModel;
		
		// Explicitly reference methods to ensure they're bundled
		if (taskModelRef) {
			// These method references force the bundler to include the model
			const findManyRef = taskModelRef.findMany;
			const findUniqueRef = taskModelRef.findUnique;
			const createRef = taskModelRef.create;
			const updateRef = taskModelRef.update;
			const deleteRef = taskModelRef.delete;
			
			// Store method references to prevent optimization
			prisma._taskModelMethods = {
				findMany: findManyRef,
				findUnique: findUniqueRef,
				create: createRef,
				update: updateRef,
				delete: deleteRef,
			};
		}
		
		// Store all models with explicit references
		const models = {
			user: prisma.user,
			project: prisma.project,
			taskModel: taskModelRef,  // Use the stored reference
			todo: prisma.todo,
		};
		
		// Store references to prevent optimization
		prisma._models = models;
		prisma._taskModelRef = taskModelRef;
		
		// Log available models for debugging - DON'T throw error, just log
		if (typeof console !== 'undefined' && console.log) {
			const availableModels = Object.keys(prisma).filter(key => 
				!key.startsWith('_') && 
				!key.startsWith('$') && 
				typeof prisma[key] === 'object' &&
				prisma[key] !== null &&
				prisma[key] !== undefined
			);
			console.log('Prisma client created. Available models:', availableModels);
			console.log('TaskModel available:', !!prisma.taskModel);
			console.log('TaskModel type:', typeof prisma.taskModel);
			console.log('All prisma keys:', Object.keys(prisma));
			
			// Try to access taskModel via different methods
			console.log('prisma.taskModel:', prisma.taskModel);
			console.log('prisma["taskModel"]:', prisma["taskModel"]);
			
			if (prisma.taskModel) {
				console.log('TaskModel methods:', Object.keys(prisma.taskModel).slice(0, 10));
			} else {
				console.error('TaskModel is MISSING! Available models:', availableModels);
			}
		}
		
		return prisma;
	} catch (error) {
		console.error('Error creating Prisma client:', error);
		throw error;
	}
}

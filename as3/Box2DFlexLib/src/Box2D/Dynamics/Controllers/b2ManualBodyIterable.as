/*
* Copyright (c) 2010 Adam Newgas http://www.boristhebrave.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

package Box2D.Dynamics.Controllers 
{
import Box2D.Dynamics.*;
import flash.events.*;
	
	/**
	 * Adapts a regular vector to a IBodyIterable.
	 */
	public class b2ManualBodyIterable implements IBodyIterable
	{
		/**
		 * Constructs a b2ManualBodyIterable from passed in bodies.
		 */
		public static function FromBodies(...bodies):b2ManualBodyIterable
		{
			return b2ManualBodyIterable.FromArray(bodies)
		}
		
		/**
		 * Constructs a b2ManualBodyIterable from an Array of bodies.
		 */
		public static function FromArray(bodyList:Array):b2ManualBodyIterable
		{
			var bodyList2:Vector.<b2Body> = new Vector.<b2Body>();
			for each(var body:b2Body in bodyList)
			{
				bodyList2[bodyList2.length] = body;
			}
			return new b2ManualBodyIterable(bodyList2);
		}
		
		/**
		 * Constructs a b2ManualBodyIterable from a Vector of bodies.
		 */
		public function b2ManualBodyIterable(bodyList:Vector.<b2Body> = null)
		{
			var bodyList2:Vector.<b2Body> = new Vector.<b2Body>();
			if (bodyList)
			{
				for each(var body:b2Body in bodyList)
				{
					bodyList2[bodyList2.length] = body;
				}
			}
			m_bodyList = bodyList2;
		}
		
		/** Adds a body to the container */
		public function AddBody(body:b2Body):void
		{
			var p:int = m_bodyList.indexOf(body);
			if (p != -1)
				return;
			m_bodyList[m_bodyList.length] = body;
			GetEventDispatcher(body).addEventListener(b2World.REMOVEBODY, OnBodyRemoved, false, 0, true);
		}
		
		/** Removes a body to a controller */
		public function RemoveBody(body:b2Body):void
		{
			var p:int = m_bodyList.indexOf(body);
			if (p == -1)
				return;
			m_bodyList.splice(p, 1);
			GetEventDispatcher(body).removeEventListener(b2World.REMOVEBODY, OnBodyRemoved);
		}
		
		/** Removes all bodies */
		public function Clear():void
		{
			while (m_bodyList.length > 0)
				RemoveBody(m_bodyList[0]);
		}
		
		private function OnBodyRemoved(e:b2BodyEvent):void
		{
			RemoveBody(e.body);
		}
		
		private function GetEventDispatcher(body:b2Body):IEventDispatcher
		{
			var dispatcher:IEventDispatcher = body.GetEventDispatcher();
			if (!dispatcher)
			{
				dispatcher = new EventDispatcher();
				body.SetEventDispatcher(dispatcher);
			}
			return dispatcher;
		}
		
		/** @inheritDoc */
		public function GetIterator():IBodyIterator
		{
			var iter:b2ManualBodyIterator = new b2ManualBodyIterator();
			iter.bodyList = m_bodyList;
			return iter;
		}
		
		/** @inheritDoc */
		public function ResetIterator(iterator:IBodyIterator):IBodyIterator
		{
			var iter:b2ManualBodyIterator = iterator as b2ManualBodyIterator;
			iter.bodyList = m_bodyList;
			iter.position = 0;
			return iter;
		}
		
		private var m_bodyList:Vector.<b2Body>;
	}
	
}
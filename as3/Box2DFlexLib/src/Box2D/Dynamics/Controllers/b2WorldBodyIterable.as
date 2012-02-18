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
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2World;
	
	/**
	 * Provides iterators from every body in the world, optionally passing some filter.
	 */
	public class b2WorldBodyIterable implements IBodyIterable
	{
		public function b2WorldBodyIterable(world:b2World)
		{
			m_world = world;
		}
		
		/**
		 * Gets the filter used to restrict bodies returned.
		 */
		public function GetFilter():Function
		{
			return m_filter;
		}
		
		/**
		 * Sets the filter used to restrict bodies returned.
		 * Filter should be a Function with signature
		 * 
		 * <code>
		 * function filter(body:b2Body):Boolean
		 * </code>
		 * 
		 * where return true means the body should be in the iterator.
		 */
		public function SetFilter(filter:Function):void
		{
			m_filter = filter;
		}
		
		/** @inheritDoc */
		public function GetIterator():IBodyIterator
		{
			if (m_filter != null)
				return new b2FilteringWorldBodyIterator(m_world,m_filter);
			else
				return new b2WorldBodyIterator(m_world);
		}
		
		/** @inheritDoc */
		public function ResetIterator(iterator:IBodyIterator):IBodyIterator
		{
			if (m_filter != null)
			{
				if (iterator is b2FilteringWorldBodyIterator)
				{
					var iter1:b2FilteringWorldBodyIterator = iterator as b2FilteringWorldBodyIterator;
					iter1.Reset(m_world, m_filter);
					return iter1;
				}else{
					return GetIterator();
				}
			}else {
				if (iterator is b2WorldBodyIterator)
				{
					var iter2:b2WorldBodyIterator = iterator as b2WorldBodyIterator;
					iter2.Reset(m_world);
					return iter2;
				}else{
					return GetIterator();
				}
			}
		}
		
		private var m_filter:Function;
		private var m_world:b2World;
	}
	
}
import Box2D.Dynamics.b2Body;
import Box2D.Dynamics.b2World;
import Box2D.Dynamics.Controllers.IBodyIterator;

internal class b2WorldBodyIterator implements IBodyIterator
{
	public var body:b2Body;
	
	public function b2WorldBodyIterator(world:b2World)
	{
		Reset(world);
	}
	
	public function Reset(world:b2World):void
	{
		body = world.GetBodyList();
	}
	
	public function HasNext():Boolean
	{
		return body != null;
	}
		
	public function Next():b2Body
	{
		var localBody:b2Body = body;
		body = body.GetNext();
		return localBody;
	}
}

internal class b2FilteringWorldBodyIterator implements IBodyIterator
{
	public var body:b2Body;
	public var filter:Function;
	
	public function b2FilteringWorldBodyIterator(world:b2World, filter:Function)
	{
		Reset(world, filter);
	}
	
	public function Reset(world:b2World, filter:Function):void
	{
		this.body = world.GetBodyList();
		this.filter = filter;
		Seek();
	}
	
	public function HasNext():Boolean
	{
		return body != null;
	}
		
	public function Next():b2Body
	{
		var localBody:b2Body = body;
		body = body.GetNext();
		Seek();
		return localBody;
	}
	
	private function Seek():void
	{
		while (body && !filter(body))
		{
			body = body.GetNext();
		}
	}
}
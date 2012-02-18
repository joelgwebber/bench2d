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
	
	/**
	 * Lists all bodies touching the given body. You'd usually want to 
	 * pass in a sensor.
	 */
	public class b2TouchingBodyIterable implements IBodyIterable
	{
		
		public function b2TouchingBodyIterable(body:b2Body)
		{
			m_body = body;
		}
		
		/** @inheritDoc */
		public function GetIterator():IBodyIterator
		{
			var iterator:b2TouchingBodyIterator = new b2TouchingBodyIterator();
			return ResetIterator(iterator);
		}
		
		/** @inheritDoc */
		public function ResetIterator(iterator:IBodyIterator):IBodyIterator
		{
			var iterator2:b2TouchingBodyIterator = iterator as b2TouchingBodyIterator;
			iterator2.contactEdge = m_body.GetContactList();
			iterator2.seen.length = 0;
			return iterator2;
		}
		
		private var m_body:b2Body;
	}
	
}
import Box2D.Dynamics.b2Body;
import Box2D.Dynamics.Contacts.b2ContactEdge;
import Box2D.Dynamics.Controllers.IBodyIterator;

internal class b2TouchingBodyIterator implements IBodyIterator
{
	public var contactEdge:b2ContactEdge;
	public var seen:Vector.<b2Body> = new Vector.<b2Body>();
	
	public function HasNext():Boolean
	{
		return contactEdge != null;
	}
		
	public function Next():b2Body
	{
		var localBody:b2Body = contactEdge.other;
		seen[seen.length] = localBody;
		Seek();
		return localBody;
	}
	
	public function Seek():void
	{
		while (contactEdge && seen.indexOf(contactEdge.other)!==-1 )
		{
			contactEdge = contactEdge.next;
		}
	}
}
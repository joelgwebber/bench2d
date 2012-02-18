/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
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
	
import Box2D.Common.b2internal;
use namespace b2internal;
	
/**
 * Base class for controllers. Controllers are a convience for encapsulating common
 * per-step functionality.
 * 
 * Controllers do not use factory mathods, you simply create them with new, and use 
 * b2World#AddController.
 */
public class b2Controller 
{
	public function b2Controller()
	{
		SetBodyIterable(new b2ManualBodyIterable());
	}
	
	/** Called internally once per step */
	public virtual function Step(step:b2TimeStep):void {}
		
	/** Called by debug draw routines */
	public virtual function Draw(debugDraw:b2DebugDraw):void { }
	
	/** Add a body to the container. Use Set/GetBodyIterable for finer control. */
	public function AddBody(body:b2Body) : void 
	{
		GetManualBodyIterable().AddBody(body);
	}
	
	/** Add a body to the container. Use Set/GetBodyIterable for finer control. */
	public function RemoveBody(body:b2Body) : void
	{
		GetManualBodyIterable().RemoveBody(body);
	}
	
	/** Add a body to the container. Use Set/GetBodyIterable for finer control. */
	public function Clear():void
	{
		GetManualBodyIterable().Clear();
	}
	
	/** Get the next controller in the world list */
	public function GetNext():b2Controller { return m_next; }
	/** Get the world this controller is in */
	public function GetWorld():b2World { return m_world; }
	
	/** Set the container of bodies that this controller has influence on. */
	public function SetBodyIterable(iterable:IBodyIterable):void
	{
		m_bodyIterable = iterable;
	}
	
	/** Set the container of bodies that this controller has influence on. */
	public function GetBodyIterable() : IBodyIterable
	{
		return m_bodyIterable;
	}
	
	private function GetManualBodyIterable():b2ManualBodyIterable
	{
		if (m_bodyIterable is b2ManualBodyIterable)
		{
			return m_bodyIterable as b2ManualBodyIterable;
		}else {
			throw new TypeError("The current iterable doesn't support this operation.");
		}
	}
	
	b2internal var m_next:b2Controller;
	b2internal var m_prev:b2Controller;
	
	protected var m_bodyIterable:IBodyIterable;
	
	b2internal var m_world:b2World;
}
	
}
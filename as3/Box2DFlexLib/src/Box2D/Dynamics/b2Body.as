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

package Box2D.Dynamics{


import Box2D.Dynamics.*;
import Box2D.Dynamics.Joints.*;
import Box2D.Dynamics.Contacts.*;
import Box2D.Collision.*;
import Box2D.Collision.Shapes.*;
import Box2D.Common.Math.*;
import Box2D.Common.*;
import flash.events.IEventDispatcher;

import Box2D.Common.b2internal;
use namespace b2internal;



/**
* A rigid body.
*/
public class b2Body
{
	
	/**
	 * Creates a fixture and attach it to this body. Use this function if you need
	 * to set some fixture parameters, like friction. Otherwise you can create the
	 * fixture directly from a shape.
	 * If the density is non-zero, this function automatically updates the mass of the body.
	 * Contacts are not created until the next time step.
	 * @param fixtureDef the fixture definition.
	 * @warning This function is locked during callbacks.
	 */
	public function CreateFixture(def:b2FixtureDef) : b2Fixture
	{
		m_world.CheckUnlocked();
		
		// TODO: We shouldn't have special cases like this
		if (def.shape is b2PolyLine)
		{
			var pl:b2PolyLine = (def.shape as b2PolyLine);
			var p:b2PolygonShape = new b2PolygonShape();
			def.shape = p;
			var vertices:Vector.<b2Vec2> = pl.vertices;
			for (var i:int = 1; i < vertices.length; i++ )
			{
				p.SetAsEdge(vertices[i - 1], vertices[i]);
				CreateFixture(def);
			}
			if (pl.isALoop)
			{
				p.SetAsEdge(vertices[vertices.length -1], vertices[0]);
				CreateFixture(def);
			}
			def.shape = pl;
			// Doesn't make sense to return a particular shape here
			return null;
		}
		
		var fixture:b2Fixture = new b2Fixture();
		fixture.Create(this, m_xf, def);
		
		if ( m_flags & e_activeFlag )
		{
			var broadPhase:IBroadPhase = m_world.m_contactManager.m_broadPhase;
			fixture.CreateProxy(broadPhase, m_xf);
		}
		
		fixture.m_next = m_fixtureList;
		m_fixtureList = fixture;
		++m_fixtureCount;
		
		fixture.m_body = this;
		
		// Adjust mass properties if needed
		if (fixture.m_density > 0.0)
		{
			ResetMassData();
		}
		
		// Let the world know we have a new fixture. This will cause new contacts to be created
		// at the beginning of the next time step.
		m_world.m_flags |= b2World.e_newFixture;
		
		// Events
		m_world.m_addFixtureEvent.fixture = fixture;
		m_world.dispatchEvent(m_world.m_addFixtureEvent);
		if (m_eventDispatcher) m_eventDispatcher.dispatchEvent(m_world.m_addFixtureEvent);
		
		return fixture;
	}

	/**
	 * Creates a fixture from a shape and attach it to this body.
	 * This is a convenience function. Use b2FixtureDef if you need to set parameters
	 * like friction, restitution, user data, or filtering.
	 * This function automatically updates the mass of the body.
	 * @param shape the shape to be cloned.
	 * @param density the shape density (set to zero for static bodies).
	 * @warning This function is locked during callbacks.
	 */
	public function CreateFixture2(shape:b2Shape, density:Number=0):b2Fixture
	{
		var def:b2FixtureDef = new b2FixtureDef();
		def.shape = shape;
		def.density = density;
		
		return CreateFixture(def);
	}
	
	/**
	 * Destroy a fixture. This removes the fixture from the broad-phase and
	 * destroys all contacts associated with this fixture. This will
	 * automatically adjust the mass of the body if the body is dynamic and the
	 * fixture has positive density.
	 * All fixtures attached to a body are implicitly destroyed when the body is destroyed.
	 * @param fixture the fixture to be removed.
	 * @warning This function is locked during callbacks.
	 */
	public function DestroyFixture(fixture:b2Fixture) : void
	{
		m_world.CheckUnlocked();
		
		if (!fixture.m_body)
			throw new Error("You cannot delete a fixture twice.");
		
		// Events
		m_world.m_removeFixtureEvent.fixture = fixture;
		if (m_eventDispatcher) m_eventDispatcher.dispatchEvent(m_world.m_removeFixtureEvent);
		m_world.dispatchEvent(m_world.m_removeFixtureEvent);
		
		
		//b2Settings.b2Assert(m_fixtureCount > 0);
		//b2Fixture** node = &m_fixtureList;
		var node:b2Fixture = m_fixtureList;
		var ppF:b2Fixture = null; // Fix pointer-pointer stuff
		var found:Boolean = false;
		while (node != null)
		{
			if (node == fixture)
			{
				if (ppF)
					ppF.m_next = fixture.m_next;
				else
					m_fixtureList = fixture.m_next;
				//node = fixture.m_next;
				found = true;
				break;
			}
			
			ppF = node;
			node = node.m_next;
		}
		
		// You tried to remove a shape that is not attached to this body.
		//b2Settings.b2Assert(found);
		
		// Destroy any contacts associated with the fixture.
		var edge:b2ContactEdge = m_contactList;
		while (edge)
		{
			var c:b2Contact = edge.contact;
			edge = edge.next;
			
			var fixtureA:b2Fixture = c.GetFixtureA();
			var fixtureB:b2Fixture = c.GetFixtureB();
			if (fixture == fixtureA || fixture == fixtureB)
			{
				// This destros the contact and removes it from
				// this body's contact list
				m_world.m_contactManager.Destroy(c);
			}
		}
		
		if ( m_flags & e_activeFlag )
		{
			var broadPhase:IBroadPhase = m_world.m_contactManager.m_broadPhase;
			fixture.DestroyProxy(broadPhase);
		}
		else
		{
			//b2Assert(fixture->m_proxyId == b2BroadPhase::e_nullProxy);
		}
		
		fixture.Destroy();
		fixture.m_body = null;
		fixture.m_next = null;
		
		--m_fixtureCount;
		
		// Reset the mass data.
		ResetMassData();
		
		fixture.m_body = null;
	}

	/**
	* Set the position of the body's origin and rotation (radians).
	* This breaks any contacts and wakes the other bodies.
	* @param position the new world position of the body's origin (not necessarily
	* the center of mass).
	* @param angle the new world rotation angle of the body in radians.
	*/
	public function SetPositionAndAngle(position:b2Vec2, angle:Number) : void{
		
		var f:b2Fixture;
		
		m_world.CheckUnlocked();
		
		m_xf.R.Set(angle);
		m_xf.position.SetV(position);
		
		//m_sweep.c0 = m_sweep.c = b2Mul(m_xf, m_sweep.localCenter);
		//b2MulMV(m_xf.R, m_sweep.localCenter);
		var tMat:b2Mat22 = m_xf.R;
		var tVec:b2Vec2 = m_sweep.localCenter;
		// (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y)
		m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		// (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y)
		m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		//return T.position + b2Mul(T.R, v);
		m_sweep.c.x += m_xf.position.x;
		m_sweep.c.y += m_xf.position.y;
		//m_sweep.c0 = m_sweep.c
		m_sweep.c0.SetV(m_sweep.c);
		
		m_sweep.a0 = m_sweep.a = angle;
		
		var broadPhase:IBroadPhase = m_world.m_contactManager.m_broadPhase;
		for (f = m_fixtureList; f; f = f.m_next)
		{
			f.Synchronize(broadPhase, m_xf, m_xf);
		}
		m_world.m_contactManager.FindNewContacts();
	}
	
	/**
	 * Set the position of the body's origin and rotation (radians).
	 * This breaks any contacts and wakes the other bodies.
	 * Note this is less efficient than the other overload - you should use that
	 * if the angle is available.
	 * Manipulating a body's transform may cause non-physical behavior.
	 * @param xf the transform of position and angle to set the bdoy to.
	 */
	public function SetTransform(xf:b2Transform):void
	{
		SetPositionAndAngle(xf.position, xf.GetAngle());
	}

	/**
	* Get the body transform for the body's origin.
	* @return the world transform of the body's origin.
	*/
	public function GetTransform() : b2Transform{
		return m_xf;
	}

	/**
	* Get the world body origin position.
	* @return the world position of the body's origin.
	*/
	public function GetPosition() : b2Vec2{
		return m_xf.position;
	}
	
	/**
	 * Setthe world body origin position.
	 * @param position the new position of the body
	 */
	public function SetPosition(position:b2Vec2):void
	{
		SetPositionAndAngle(position, GetAngle());
	}

	/**
	* Get the angle in radians.
	* @return the current world rotation angle in radians.
	*/
	public function GetAngle() : Number{
		return m_sweep.a;
	}
	
	/**
	 * Set the world body angle
	 * @param angle the new angle of the body.
	 */
	public function SetAngle(angle:Number) : void
	{
		SetPositionAndAngle(GetPosition(), angle);
	}
	

	/**
	* Get the world position of the center of mass.
	*/
	public function GetWorldCenter() : b2Vec2{
		return m_sweep.c;
	}

	/**
	* Get the local position of the center of mass.
	*/
	public function GetLocalCenter() : b2Vec2{
		return m_sweep.localCenter;
	}

	/**
	* Set the linear velocity of the center of mass.
	* @param v the new linear velocity of the center of mass.
	*/
	public function SetLinearVelocity(v:b2Vec2) : void {
		if ( m_type == b2_staticBody )
		{
			return;
		}
		m_linearVelocity.SetV(v);
	}

	/**
	* Get the linear velocity of the center of mass.
	* @return the linear velocity of the center of mass.
	*/
	public function GetLinearVelocity() : b2Vec2{
		return m_linearVelocity;
	}

	/**
	* Set the angular velocity.
	* @param omega the new angular velocity in radians/second.
	*/
	public function SetAngularVelocity(omega:Number) : void {
		if ( m_type == b2_staticBody )
		{
			return;
		}
		m_angularVelocity = omega;
	}

	/**
	* Get the angular velocity.
	* @return the angular velocity in radians/second.
	*/
	public function GetAngularVelocity() : Number{
		return m_angularVelocity;
	}
	
	/**
	 * Get the definition containing the body properties.
	 * @asonly
	 */
	public function GetDefinition() : b2BodyDef
	{
		var bd:b2BodyDef = new b2BodyDef();
		bd.type = GetType();
		bd.allowSleep = (m_flags & e_allowSleepFlag) == e_allowSleepFlag;
		bd.angle = GetAngle();
		bd.angularDamping = m_angularDamping;
		bd.angularVelocity = m_angularVelocity;
		bd.fixedRotation = (m_flags & e_fixedRotationFlag) == e_fixedRotationFlag;
		bd.bullet = (m_flags & e_bulletFlag) == e_bulletFlag;
		bd.awake = (m_flags & e_awakeFlag) == e_awakeFlag;
		bd.linearDamping = m_linearDamping;
		bd.linearVelocity.SetV(GetLinearVelocity());
		bd.position = GetPosition();
		bd.userData = GetUserData();
		return bd;
	}
	
	/**
	 * Sets all body properties.
	 * @asonly
	 */
	public function SetDefinition(bd:b2BodyDef):void
	{
		
		SetType(bd.type);
		SetSleepingAllowed(bd.allowSleep);
		SetPositionAndAngle(bd.position, bd.angle);
		m_angularDamping = bd.angularDamping;
		m_angularVelocity = bd.angularVelocity;
		SetFixedRotation(bd.fixedRotation);
		SetBullet(bd.bullet);
		SetAwake(bd.awake);
		m_linearDamping = bd.linearDamping;
		m_linearVelocity.SetV(bd.linearVelocity);
		m_userData = bd.userData;
	}

	/**
	* Apply a force at a world point. If the force is not
	* applied at the center of mass, it will generate a torque and
	* affect the angular velocity. This wakes up the body.
	* @param force the world force vector, usually in Newtons (N).
	* @param point the world position of the point of application.
	*/
	public function ApplyForce(force:b2Vec2, point:b2Vec2) : void{
		if (m_type != b2_dynamicBody)
		{
			return;
		}
		
		if (IsAwake() == false)
		{
			SetAwake(true);
		}
		
		//m_force += force;
		m_force.x += force.x;
		m_force.y += force.y;
		//m_torque += b2Cross(point - m_sweep.c, force);
		m_torque += ((point.x - m_sweep.c.x) * force.y - (point.y - m_sweep.c.y) * force.x);
	}

	/**
	* Apply a torque. This affects the angular velocity
	* without affecting the linear velocity of the center of mass.
	* This wakes up the body.
	* @param torque about the z-axis (out of the screen), usually in N-m.
	*/
	public function ApplyTorque(torque:Number) : void {
		if (m_type != b2_dynamicBody)
		{
			return;
		}
		
		if (IsAwake() == false)
		{
			SetAwake(true);
		}
		m_torque += torque;
	}

	/**
	* Apply an impulse at a point. This immediately modifies the velocity.
	* It also modifies the angular velocity if the point of application
	* is not at the center of mass. This wakes up the body.
	* @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
	* @param point the world position of the point of application.
	*/
	public function ApplyLinearImpulse(impulse:b2Vec2, point:b2Vec2) : void{
		if (m_type != b2_dynamicBody)
		{
			return;
		}
		
		if (IsAwake() == false)
		{
			SetAwake(true);
		}
		//m_linearVelocity += m_invMass * impulse;
		m_linearVelocity.x += m_invMass * impulse.x;
		m_linearVelocity.y += m_invMass * impulse.y;
		//m_angularVelocity += m_invI * b2Cross(point - m_sweep.c, impulse);
		m_angularVelocity += m_invI * ((point.x - m_sweep.c.x) * impulse.y - (point.y - m_sweep.c.y) * impulse.x);
	}
	
	/**
	 * Apply an angular impulse
	 * @param impulse the angular impulse in units of kg*m*m/s
	 */
	public function ApplyAngularImpulse(impulse:Number):void
	{
		if (m_type != b2_dynamicBody)
			return;
			
		if (IsAwake() == false)
			SetAwake(true);
			
		m_angularVelocity += m_invI * impulse;
	}
	
	/**
	 * Splits a body into two, preserving dynamic properties
	 * @param	callback Called once per fixture, return true to move this fixture to the new body
	 * <code>function Callback(fixture:b2Fixture):Boolean</code>
	 * @return The newly created bodies
	 * @asonly
	 */
	public function Split(callback:Function):b2Body
	{
		var linearVelocity:b2Vec2 = GetLinearVelocity().Copy();//Reset mass will alter this
		var angularVelocity:Number = GetAngularVelocity();
		var center:b2Vec2 = GetWorldCenter();
		var body1:b2Body = this;
		var body2:b2Body = m_world.CreateBody(GetDefinition());
		
		var prev:b2Fixture;
		for (var f:b2Fixture = body1.m_fixtureList; f; )
		{
			if (callback(f))
			{
				var next:b2Fixture = f.m_next;
				// Remove fixture
				if (prev)
				{
					prev.m_next = next;
				}else {
					body1.m_fixtureList = next;
				}
				body1.m_fixtureCount--;
				
				// Add fixture
				f.m_next = body2.m_fixtureList;
				body2.m_fixtureList = f;
				body2.m_fixtureCount++;
				
				f.m_body = body2;
				
				f = next;
			}else {
				prev = f;
				f = f.m_next
			}
		}
		
		body1.ResetMassData();
		body2.ResetMassData();
		
		// Compute consistent velocites for new bodies based on cached velocity
		var center1:b2Vec2 = body1.GetWorldCenter();
		var center2:b2Vec2 = body2.GetWorldCenter();
		
		var velocity1:b2Vec2 = b2Math.AddVV(linearVelocity, 
			b2Math.CrossFV(angularVelocity,
				b2Math.SubtractVV(center1, center)));
				
		var velocity2:b2Vec2 = b2Math.AddVV(linearVelocity, 
			b2Math.CrossFV(angularVelocity,
				b2Math.SubtractVV(center2, center)));
				
		body1.SetLinearVelocity(velocity1);
		body2.SetLinearVelocity(velocity2);
		body1.SetAngularVelocity(angularVelocity);
		body2.SetAngularVelocity(angularVelocity);
		
		body1.SynchronizeFixtures();
		body2.SynchronizeFixtures();
		
		return body2;
	}

	/**
	 * Merges another body into this. Only fixtures, mass and velocity are effected,
	 * Other properties are ignored
	 * @asonly
	 */
	public function Merge(other:b2Body):void
	{
		m_world.CheckUnlocked();
		
		var body1:b2Body = this;
		var body2:b2Body = other;
		
		// Compute consistent velocites for new bodies based on cached velocity
		
		var center1:b2Vec2 = body1.GetWorldCenter();
		var center2:b2Vec2 = body2.GetWorldCenter();
		
		var v1:b2Vec2 = body1.GetLinearVelocity();
		var v2:b2Vec2 = body2.GetLinearVelocity();
		
		var m1:Number = body1.GetMass();
		var m2:Number = body2.GetMass();
		
		var c:b2Vec2 = b2Math.AddVV(
			b2Math.MulFV(m1, center1),
			b2Math.MulFV(m2, center2));
		var mass:Number = m1 + m2;
		c.x /= mass;
		c.y /= mass;
		
		var v:b2Vec2 = b2Math.AddVV(
			b2Math.MulFV(m1, v1),
			b2Math.MulFV(m2, v2));
		
		var r1:b2Vec2 = b2Math.SubtractVV(center1, c);
		var r2:b2Vec2 = b2Math.SubtractVV(center2, c);
		
		var angularMomentum:Number = 
			body1.GetAngularVelocity() * body1.GetInertia() + m1 * b2Math.CrossVV(r1, v1)
			body2.GetAngularVelocity() * body2.GetInertia() + m2 * b2Math.CrossVV(r2, v2);
		
		var I:Number = 
			body1.GetInertia() + m1 * r1.LengthSquared() + 
			body2.GetInertia() + m2 * r2.LengthSquared();
			
		// Copy fixtures
		var xf:b2Transform = b2Math.MulXX(
			body1.GetTransform().GetInverse(),
			body2.GetTransform());
		var f:b2Fixture;
		for (f = other.m_fixtureList; f; f=f.m_next)
		{
			var fd:b2FixtureDef = f.GetDefinition();
			fd.shape.MulBy(xf);
			body1.CreateFixture(fd);
		}
		
		var md:b2MassData = new b2MassData();
		md.center = b2Math.MulXT(body1.GetTransform(), c);
		md.I = I + mass * md.center.LengthSquared();
		md.mass = mass;
		SetMassData(md);
		
		m_linearVelocity.x = (v1.x * m1 + v2.x * m2) / mass;
		m_linearVelocity.y = (v1.y * m1 + v2.y * m2) / mass;
		m_angularVelocity = angularMomentum / I;
		
		m_world.DestroyBody(body2);
		
		SynchronizeFixtures();
	}
	
	/**
	* Get the total mass of the body.
	* @return the mass, usually in kilograms (kg).
	*/
	public function GetMass() : Number{
		return m_mass;
	}

	/**
	* Get the central rotational inertia of the body.
	* @return the rotational inertia, usually in kg-m^2.
	*/
	public function GetInertia() : Number{
		return m_I;
	}
	
	/** 
	 * Get the mass data of the body. The rotational inertial is relative to the center of mass.
	 */
	public function GetMassData(data:b2MassData):void
	{
		data.mass = m_mass;
		data.I = m_I;
		data.center.SetV(m_sweep.localCenter);
	}
	
	/**
	 * Set the mass properties to override the mass properties of the fixtures
	 * Note that this changes the center of mass position.
	 * Note that creating or destroying fixtures can also alter the mass.
	 * This function has no effect if the body isn't dynamic.
	 * @warning The supplied rotational inertia should be relative to the center of mass
	 * @param	data the mass properties.
	 */
	public function SetMassData(massData:b2MassData):void
	{
		m_world.CheckUnlocked();
		
		if (m_type != b2_dynamicBody)
		{
			return;
		}
		
		m_invMass = 0.0;
		m_I = 0.0;
		m_invI = 0.0;
		
		m_mass = massData.mass;
		
		// Compute the center of mass.
		if (m_mass <= 0.0)
		{
			m_mass = 1.0;
		}
		m_invMass = 1.0 / m_mass;
		
		if (massData.I > 0.0 && (m_flags & e_fixedRotationFlag) == 0)
		{
			// Center the inertia about the center of mass
			m_I = massData.I - m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
			m_invI = 1.0 / m_I;
		}
		
		// Move center of mass
		var oldCenter:b2Vec2 = m_sweep.c.Copy();
		m_sweep.localCenter.SetV(massData.center);
		m_sweep.c0.SetV(b2Math.MulX(m_xf, m_sweep.localCenter));
		m_sweep.c.SetV(m_sweep.c0);
		
		// Update center of mass velocity
		//m_linearVelocity += b2Cross(m_angularVelocity, m_sweep.c - oldCenter);
		m_linearVelocity.x += m_angularVelocity * -(m_sweep.c.y - oldCenter.y);
		m_linearVelocity.y += m_angularVelocity * +(m_sweep.c.x - oldCenter.x);
		
	}
	
	/**
	 * This resets the mass properties to the sum of the mass properties of the fixtures.
	 * This normally does not need to be called unless you called SetMassData to override
	 * the mass and later you want to reset the mass.
	 */
	public function ResetMassData():void
	{
		// Compute mass data from shapes. Each shape has it's own density
		m_mass = 0.0;
		m_invMass = 0.0;
		m_I = 0.0;
		m_invI = 0.0;
		m_sweep.localCenter.SetZero();
		
		var center:b2Vec2 = b2Vec2.Make(0, 0);
		
		// Static and kinematic bodies have zero mass.
		if (m_type == b2_staticBody || m_type == b2_kinematicBody)
		{
			m_sweep.c0.x = m_sweep.c.x  = m_xf.position.x;
			m_sweep.c0.y = m_sweep.c.y  = m_xf.position.y;
			return;
		}
		
		{
			//b2Assert(m_type == b2_dynamicBody);
			
			// Accumulate mass over all fixtures.
			for (var f:b2Fixture = m_fixtureList; f; f = f.m_next)
			{
				if (f.m_density == 0.0)
				{
					continue;
				}
				
				var massData:b2MassData = f.GetMassData();
				m_mass += massData.mass;
				center.x += massData.center.x * massData.mass;
				center.y += massData.center.y * massData.mass;
				m_I += massData.I;
			}
			
			// Compute the center of mass.
			if (m_mass > 0.0)
			{
				m_invMass = 1.0 / m_mass;
				center.x *= m_invMass;
				center.y *= m_invMass;
			}
			else
			{
				// Force all dynamic bodies to have a positive mass.
				m_mass = 1.0;
				m_invMass = 1.0;
			}
			
			if (m_I > 0.0 && (m_flags & e_fixedRotationFlag) == 0)
			{
				// Center the inertia about the center of mass
				m_I -= m_mass * (center.x * center.x + center.y * center.y);
				m_I *= m_inertiaScale;
				b2Settings.b2Assert(m_I > 0);
				m_invI = 1.0 / m_I;
			}else {
				m_I = 0.0;
				m_invI = 0.0;
			}
		}
		
		// Move center of mass
		var oldCenter:b2Vec2 = m_sweep.c.Copy();
		m_sweep.localCenter.SetV(center);
		m_sweep.c0.SetV(b2Math.MulX(m_xf, m_sweep.localCenter));
		m_sweep.c.SetV(m_sweep.c0);
		
		// Update center of mass velocity
		//m_linearVelocity += b2Cross(m_angularVelocity, m_sweep.c - oldCenter);
		m_linearVelocity.x += m_angularVelocity * -(m_sweep.c.y - oldCenter.y);
		m_linearVelocity.y += m_angularVelocity * +(m_sweep.c.x - oldCenter.x);
		
	}
	  
	/**
	 * Get the world coordinates of a point given the local coordinates.
	 * @param localPoint a point on the body measured relative the the body's origin.
	 * @return the same point expressed in world coordinates.
	 */
	public function GetWorldPoint(localPoint:b2Vec2) : b2Vec2{
		//return b2Math.b2MulX(m_xf, localPoint);
		var A:b2Mat22 = m_xf.R;
		var u:b2Vec2 = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, 
								  A.col1.y * localPoint.x + A.col2.y * localPoint.y);
		u.x += m_xf.position.x;
		u.y += m_xf.position.y;
		return u;
	}

	/**
	 * Get the world coordinates of a vector given the local coordinates.
	 * @param localVector a vector fixed in the body.
	 * @return the same vector expressed in world coordinates.
	 */
	public function GetWorldVector(localVector:b2Vec2) : b2Vec2{
		return b2Math.MulMV(m_xf.R, localVector);
	}

	/**
	 * Gets a local point relative to the body's origin given a world point.
	 * @param a point in world coordinates.
	 * @return the corresponding local point relative to the body's origin.
	 */
	public function GetLocalPoint(worldPoint:b2Vec2) : b2Vec2{
		return b2Math.MulXT(m_xf, worldPoint);
	}

	/**
	 * Gets a local vector given a world vector.
	 * @param a vector in world coordinates.
	 * @return the corresponding local vector.
	 */
	public function GetLocalVector(worldVector:b2Vec2) : b2Vec2{
		return b2Math.MulTMV(m_xf.R, worldVector);
	}
	
	/**
	* Get the world linear velocity of a world point attached to this body.
	* @param a point in world coordinates.
	* @return the world velocity of a point.
	*/
	public function GetLinearVelocityFromWorldPoint(worldPoint:b2Vec2) : b2Vec2
	{
		//return          m_linearVelocity   + b2Cross(m_angularVelocity,   worldPoint   - m_sweep.c);
		return new b2Vec2(m_linearVelocity.x -         m_angularVelocity * (worldPoint.y - m_sweep.c.y), 
		                  m_linearVelocity.y +         m_angularVelocity * (worldPoint.x - m_sweep.c.x));
	}
	
	/**
	* Get the world velocity of a local point.
	* @param a point in local coordinates.
	* @return the world velocity of a point.
	*/
	public function GetLinearVelocityFromLocalPoint(localPoint:b2Vec2) : b2Vec2
	{
		//return GetLinearVelocityFromWorldPoint(GetWorldPoint(localPoint));
		var A:b2Mat22 = m_xf.R;
		var worldPoint:b2Vec2 = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, 
		                                   A.col1.y * localPoint.x + A.col2.y * localPoint.y);
		worldPoint.x += m_xf.position.x;
		worldPoint.y += m_xf.position.y;
		return new b2Vec2(m_linearVelocity.x -         m_angularVelocity * (worldPoint.y - m_sweep.c.y), 
		                  m_linearVelocity.y +         m_angularVelocity * (worldPoint.x - m_sweep.c.x));
	}
	
	/**
	* Get the linear damping of the body.
	*/
	public function GetLinearDamping():Number
	{
		return m_linearDamping;
	}
	
	/**
	* Set the linear damping of the body.
	*/
	public function SetLinearDamping(linearDamping:Number):void
	{
		m_linearDamping = linearDamping;
	}
	
	/**
	* Get the angular damping of the body
	*/
	public function GetAngularDamping():Number
	{
		return m_angularDamping;
	}
	
	/**
	* Set the angular damping of the body.
	*/
	public function SetAngularDamping(angularDamping:Number):void
	{
		m_angularDamping = angularDamping;
	}
	
	/**
	 * Set the type of this body. This may alter the mass and velocity
	 * @param	type - enum stored as a static member of b2Body
	 */ 
	public function SetType( type:uint ):void
	{
		if ( m_type == type )
		{
			return;
		}
		
		m_type = type;
		
		ResetMassData();
		
		if ( m_type == b2_staticBody )
		{
			m_linearVelocity.SetZero();
			m_angularVelocity = 0.0;
		}
		
		SetAwake(true);
		
		m_force.SetZero();
		m_torque = 0.0;
		
		// Since the body type changed, we need to flag contacts for filtering.
		for (var ce:b2ContactEdge = m_contactList; ce; ce = ce.next)
		{
			ce.contact.FlagForFiltering();
		}
		SynchronizeTransform();
	}
	
	/**
	 * Get the type of this body.
	 * @return type enum as a uint
	 */ 
	public function GetType():uint
	{
		return m_type;
	}

	/**
	* Should this body be treated like a bullet for continuous collision detection?
	*/
	public function SetBullet(flag:Boolean) : void{
		if (flag)
		{
			m_flags |= e_bulletFlag;
		}
		else
		{
			m_flags &= ~e_bulletFlag;
		}
	}

	/**
	* Is this body treated like a bullet for continuous collision detection?
	*/
	public function IsBullet() : Boolean{
		return (m_flags & e_bulletFlag) == e_bulletFlag;
	}
	
	/**
	 * Is this body allowed to sleep
	 * @param	flag
	 */
	public function SetSleepingAllowed(flag:Boolean):void{
		if (flag)
		{
			m_flags |= e_allowSleepFlag;
		}
		else
		{
			m_flags &= ~e_allowSleepFlag;
			SetAwake(true);
		}
	}
	
	/**
	 * Set the sleep state of the body. A sleeping body has vety low CPU cost.
	 * @param	flag - set to false to put body to sleep, true to wake it
	 */
	public function SetAwake(flag:Boolean):void {
		if (flag)
		{
			m_flags |= e_awakeFlag;
			m_sleepTime = 0.0;
		}
		else
		{
			m_flags &= ~e_awakeFlag;
			m_sleepTime = 0.0;
			m_linearVelocity.SetZero();
			m_angularVelocity = 0.0;
			m_force.SetZero();
			m_torque = 0.0;
		}
	}
	
	/**
	 * Get the sleeping state of this body.
	 * @return true if body is sleeping
	 */
	public function IsAwake():Boolean {
		return (m_flags & e_awakeFlag) == e_awakeFlag;
	}
	
	/**
	 * Set this body to have fixed rotation. This causes the mass to be reset.
	 * @param	fixed - true means no rotation
	 */
	public function SetFixedRotation(fixed:Boolean):void
	{
		if(fixed)
		{
			m_flags |= e_fixedRotationFlag;
		}
		else
		{
			m_flags &= ~e_fixedRotationFlag;
		}
		
		ResetMassData();
	}
	
	/**
	 * Get if the body has fixed rotation.
	 */
	public function GetFixedRotation():Boolean
	{
		return (m_flags & e_fixedRotationFlag) > 0;
	}
	
	/**
	* Does this body have fixed rotation?
	* @return true means fixed rotation
	*/
	public function IsFixedRotation():Boolean
	{
		return (m_flags & e_fixedRotationFlag)==e_fixedRotationFlag;
	}
	
	/** Set the active state of the body. An inactive body is not
	* simulated and cannot be collided with or woken up.
	* If you pass a flag of true, all fixtures will be added to the
	* broad-phase.
	* If you pass a flag of false, all fixtures will be removed from
	* the broad-phase and all contacts will be destroyed.
	* Fixtures and joints are otherwise unaffected. You may continue
	* to create/destroy fixtures and joints on inactive bodies.
	* Fixtures on an inactive body are implicitly inactive and will
	* not participate in collisions, ray-casts, or queries.
	* Joints connected to an inactive body are implicitly inactive.
	* An inactive body is still owned by a b2World object and remains
	* in the body list.
	*/
	public function SetActive( flag:Boolean ):void{
		if (flag == IsActive())
		{
			return;
		}
		
		var broadPhase:IBroadPhase;
		var f:b2Fixture;
		if (flag)
		{
			m_flags |= e_activeFlag;

			// Create all proxies.
			broadPhase = m_world.m_contactManager.m_broadPhase;
			for ( f = m_fixtureList; f; f = f.m_next)
			{
				f.CreateProxy(broadPhase, m_xf);
			}
			// Contacts are created the next time step.
		}
		else
		{
			m_flags &= ~e_activeFlag;

			// Destroy all proxies.
			broadPhase = m_world.m_contactManager.m_broadPhase;
			for ( f = m_fixtureList; f; f = f.m_next)
			{
				f.DestroyProxy(broadPhase);
			}

			// Destroy the attached contacts.
			var ce:b2ContactEdge = m_contactList;
			while (ce)
			{
				var ce0:b2ContactEdge = ce;
				ce = ce.next;
				m_world.m_contactManager.Destroy(ce0.contact);
			}
			m_contactList = null;
		}
	}
	
	/**
	 * Get the active state of the body.
	 * @return true if active.
	 */ 
	public function IsActive():Boolean{
		return (m_flags & e_activeFlag) == e_activeFlag;
	}
	
	/**
	* Is this body allowed to sleep?
	*/
	public function IsSleepingAllowed():Boolean
	{
		return(m_flags & e_allowSleepFlag) == e_allowSleepFlag;
	}

	/**
	* Get the list of all fixtures attached to this body.
	*/
	public function GetFixtureList() : b2Fixture{
		return m_fixtureList;
	}

	/**
	* Get the list of all joints attached to this body.
	*/
	public function GetJointList() : b2JointEdge{
		return m_jointList;
	}
	
	/**
	 * Get a list of all contacts attached to this body.
	 */
	public function GetContactList():b2ContactEdge {
		return m_contactList;
	}

	/**
	 * Get the next body in the world's body list.
	 */
	public function GetNext() : b2Body{
		return m_next;
	}

	/**
	 * Get the user data pointer that was provided in the body definition.
	 */
	public function GetUserData() : *{
		return m_userData;
	}

	/**
	 * Set the user data. Use this to store your application specific data.
	 */
	public function SetUserData(data:*) : void
	{
		m_userData = data;
	}
	
	/**
	 * Get the event dispatcher associated with this body.
	 */
	public function GetEventDispatcher() : IEventDispatcher{
		return m_eventDispatcher;
	}

	/**
	 * Set the event dispatcher. Use this to recieve events relating to the body.
	 * 
	 * The following events can are dispatched:
	 * <ul>
	 * <li>BeginContact</li>
	 * <li>EndContact</li>
	 * <li>PreSolve</li>
	 * <li>PostSolve</li>
	 * <li>AddBody</li>
	 * <li>RemoveBody</li>
	 * <li>AddFixture</li>
	 * <li>RemoveFixture</li>
	 * <li>AddJoint</li>
	 * <li>RemoveJoint</li>
	 * </ul>
	 */
	public function SetEventDispatcher(dispatcher:IEventDispatcher) : void
	{
		m_eventDispatcher = dispatcher;
	}

	/**
	 * Get the parent world of this body.
	 */
	public function GetWorld(): b2World
	{
		return m_world;
	}

	//--------------- Internals Below -------------------

	
	// Constructor
	/**
	 * @private
	 */
	public function b2Body(bd:b2BodyDef, world:b2World){
		//b2Settings.b2Assert(world.IsLocked() == false);
		
		//b2Settings.b2Assert(bd.position.IsValid());
 		//b2Settings.b2Assert(bd.linearVelocity.IsValid());
 		//b2Settings.b2Assert(b2Math.b2IsValid(bd.angle));
 		//b2Settings.b2Assert(b2Math.b2IsValid(bd.angularVelocity));
 		//b2Settings.b2Assert(b2Math.b2IsValid(bd.inertiaScale) && bd.inertiaScale >= 0.0);
 		//b2Settings.b2Assert(b2Math.b2IsValid(bd.angularDamping) && bd.angularDamping >= 0.0);
 		//b2Settings.b2Assert(b2Math.b2IsValid(bd.linearDamping) && bd.linearDamping >= 0.0);
		
		m_flags = 0;
		
		if (bd.bullet )
		{
			m_flags |= e_bulletFlag;
		}
		if (bd.fixedRotation)
		{
			m_flags |= e_fixedRotationFlag;
		}
		if (bd.allowSleep)
		{
			m_flags |= e_allowSleepFlag;
		}
		if (bd.awake)
		{
			m_flags |= e_awakeFlag;
		}
		if (bd.active)
		{
			m_flags |= e_activeFlag;
		}
		
		m_world = world;
		
		m_xf.position.SetV(bd.position);
		m_xf.R.Set(bd.angle);
		
		m_sweep.localCenter.SetZero();
		m_sweep.t0 = 1.0;
		m_sweep.a0 = m_sweep.a = bd.angle;
		
		//m_sweep.c0 = m_sweep.c = b2Mul(m_xf, m_sweep.localCenter);
		//b2MulMV(m_xf.R, m_sweep.localCenter);
		var tMat:b2Mat22 = m_xf.R;
		var tVec:b2Vec2 = m_sweep.localCenter;
		// (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y)
		m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		// (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y)
		m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		//return T.position + b2Mul(T.R, v);
		m_sweep.c.x += m_xf.position.x;
		m_sweep.c.y += m_xf.position.y;
		//m_sweep.c0 = m_sweep.c
		m_sweep.c0.SetV(m_sweep.c);
		
		m_jointList = null;
		m_contactList = null;
		m_prev = null;
		m_next = null;
		
		m_linearVelocity.SetV(bd.linearVelocity);
		m_angularVelocity = bd.angularVelocity;
		
		m_linearDamping = bd.linearDamping;
		m_angularDamping = bd.angularDamping;
		
		m_force.Set(0.0, 0.0);
		m_torque = 0.0;
		
		m_sleepTime = 0.0;
		
		m_type = bd.type;
		
		if (m_type == b2_dynamicBody)
		{
			m_mass = 1.0;
			m_invMass = 1.0;
		}
		else
		{
			m_mass = 0.0;
			m_invMass = 0.0;
		}
		
		m_I = 0.0;
		m_invI = 0.0;
		
		m_inertiaScale = bd.inertiaScale;
		
		m_userData = bd.userData;
		
		m_fixtureList = null;
		m_fixtureCount = 0;
	}
	
	// Destructor
	//~b2Body();

	//
	static private var s_xf1:b2Transform = new b2Transform();
	//
	b2internal function SynchronizeFixtures() : void{
		
		var xf1:b2Transform = s_xf1;
		xf1.R.Set(m_sweep.a0);
		//xf1.position = m_sweep.c0 - b2Mul(xf1.R, m_sweep.localCenter);
		var tMat:b2Mat22 = xf1.R;
		var tVec:b2Vec2 = m_sweep.localCenter;
		xf1.position.x = m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		xf1.position.y = m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		
		var f:b2Fixture;
		var broadPhase:IBroadPhase = m_world.m_contactManager.m_broadPhase;
		for (f = m_fixtureList; f; f = f.m_next)
		{
			f.Synchronize(broadPhase, xf1, m_xf);
		}
	}

	b2internal function SynchronizeTransform() : void{
		m_xf.R.Set(m_sweep.a);
		//m_xf.position = m_sweep.c - b2Mul(m_xf.R, m_sweep.localCenter);
		var tMat:b2Mat22 = m_xf.R;
		var tVec:b2Vec2 = m_sweep.localCenter;
		m_xf.position.x = m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		m_xf.position.y = m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	}

	// This is used to prevent connected bodies from colliding.
	// It may lie, depending on the collideConnected flag.
	b2internal function ShouldCollide(other:b2Body) : Boolean {
		// At least one body should be dynamic
		if (m_type != b2_dynamicBody && other.m_type != b2_dynamicBody )
		{
			return false;
		}
		// Does a joint prevent collision?
		for (var jn:b2JointEdge = m_jointList; jn; jn = jn.next)
		{
			if (jn.other == other)
			if (jn.joint.m_collideConnected == false)
			{
				return false;
			}
		}
		
		return true;
	}

	b2internal function Advance(t:Number) : void{
		// Advance to the new safe time.
		m_sweep.Advance(t);
		m_sweep.c.SetV(m_sweep.c0);
		m_sweep.a = m_sweep.a0;
		SynchronizeTransform();
	}

	b2internal var m_flags:uint;
	b2internal var m_type:int;
	
	b2internal var m_islandIndex:int;

	b2internal var m_xf:b2Transform = new b2Transform();		// the body origin transform

	b2internal var m_sweep:b2Sweep = new b2Sweep();	// the swept motion for CCD

	b2internal var m_linearVelocity:b2Vec2 = new b2Vec2();
	b2internal var m_angularVelocity:Number;

	b2internal var m_force:b2Vec2 = new b2Vec2();
	b2internal var m_torque:Number;

	b2internal var m_world:b2World;
	b2internal var m_prev:b2Body;
	b2internal var m_next:b2Body;

	b2internal var m_fixtureList:b2Fixture;
	b2internal var m_fixtureCount:int;
	
	b2internal var m_jointList:b2JointEdge;
	b2internal var m_contactList:b2ContactEdge;

	b2internal var m_mass:Number, m_invMass:Number;
	b2internal var m_I:Number, m_invI:Number;
	
	b2internal var m_inertiaScale:Number;

	b2internal var m_linearDamping:Number;
	b2internal var m_angularDamping:Number;

	b2internal var m_sleepTime:Number;

	private var m_userData:*;
	b2internal var m_eventDispatcher:IEventDispatcher;
	
	
	// m_flags
	//enum
	//{
		static b2internal var e_islandFlag:uint			= 0x0001;
		static b2internal var e_awakeFlag:uint			= 0x0002;
		static b2internal var e_allowSleepFlag:uint		= 0x0004;
		static b2internal var e_bulletFlag:uint			= 0x0008;
		static b2internal var e_fixedRotationFlag:uint	= 0x0010;
		static b2internal var e_activeFlag:uint			= 0x0020;
	//};

	// m_type
	//enum
	//{
		/// The body type.
		/// static: zero mass, zero velocity, may be manually moved
		/// kinematic: zero mass, non-zero velocity set by user, moved by solver
		/// dynamic: positive mass, non-zero velocity determined by forces, moved by solver
		static public var b2_staticBody:uint = 0;
		static public var b2_kinematicBody:uint = 1;
		static public var b2_dynamicBody:uint = 2;
	//};
	
};

}

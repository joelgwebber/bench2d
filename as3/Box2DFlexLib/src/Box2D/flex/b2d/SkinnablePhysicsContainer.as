package Box2D.flex.b2d
{
    import Box2D.Collision.Shapes.b2CircleShape;
    import Box2D.Collision.Shapes.b2PolygonShape;
    import Box2D.Collision.Shapes.b2Shape;
    import Box2D.Common.Math.b2Vec2;
    import Box2D.Common.b2Settings;
    import Box2D.Dynamics.b2Body;
    import Box2D.Dynamics.b2BodyDef;
    import Box2D.Dynamics.b2DebugDraw;
    import Box2D.Dynamics.b2FixtureDef;
    import Box2D.Dynamics.b2World;
    import Box2D.utilities.ComplexShapeParser;
    import Box2D.utilities.ComponenetToBodyMap;
    import Box2D.utilities.MeterDimensions;
    import Box2D.utilities.Polygon2D;
    import Box2D.utilities.WorldClock;
    import Box2D.utilities.WorldDefinition;
    
    import flash.display.BitmapData;
    import flash.display.MovieClip;
    import flash.display.Sprite;
    import flash.geom.ColorTransform;
    import flash.geom.Point;
    import flash.utils.Dictionary;
    
    import mx.core.IVisualElement;
    import mx.core.UIComponent;
    import mx.events.ResizeEvent;
    import mx.logging.ILogger;
    import mx.logging.Log;
    
    import net.sakri.flash.bitmap.BitmapDataUtil;
    import net.sakri.flash.bitmap.BitmapEdgeScanner;
    import net.sakri.flash.bitmap.BitmapShapeExtractor;
    import net.sakri.flash.bitmap.ExtractedShapeCollection;
    import net.sakri.flash.vector.ShapeFidality;
    import net.sakri.flash.vector.ShapeOptimizer;
    import net.sakri.flash.vector.VectorShape;
    
    import spark.components.SkinnableContainer;

	[Bindable]
    public class SkinnablePhysicsContainer extends SkinnableContainer implements IPhysicsContainer
    {
		
        private var boundries:Array;
		private var bodies:Dictionary;
		private const BOUNDRY_WEIGHT:Number=1/2;
		
		private var componentMappings:Dictionary;
		private var compisiteVisualElements:Dictionary;
		protected var debugContainer:UIComponent = new UIComponent();
		
		private var log:ILogger = Log.getLogger("Box2D.spark.SkinnablePhysicsContainer");
        
        public function SkinnablePhysicsContainer()
        {
            super();
			componentMappings = new Dictionary();
			boundries = [];
			compisiteVisualElements = new Dictionary();
			xGravity=0;
			yGravity=0;
			debug=false;
			debugInFront=false;
        }
		
		
	
		public function map(element:UIComponent,mapping:ComponenetToBodyMap):void 
		{
			componentMappings[element] = mapping;
		}
		
		public function parseCompiseteVisualElement(element:IVisualElement,parser:ComplexShapeParser=null):void
		{
			if (parser==null) 
			{
				parser = new ComplexShapeParser();
			}
			compisiteVisualElements[element] = parser;		
		}
		
		public function getShapes(element:UIComponent):Vector.<b2Shape>
		{
			return componentMappings[element];
		}
		
		override protected function createChildren():void
		{
			log.debug("createChildren");
			super.createChildren();
			initializeWorld();
			setupDebug();
		}
		
		override public function createDeferredContent():void
		{
			super.createDeferredContent();
		}

		private function onUIComponentResize(event:ResizeEvent):void
		{
			var source:* = event.target;
			var body:b2Body =  bodies[source];
			if (!body)
				return;
			if (body.GetFixtureList())
				body.DestroyFixture(body.GetFixtureList());
			
			var w:Number = source.getExplicitOrMeasuredWidth();
			var h:Number = source.getExplicitOrMeasuredHeight();
			var meter:MeterDimensions = _worldDef.meterDimentions(w,h,source.x,source.y);
			
			var shapes:Array = mappedOrDefaultShape(source,meter);
			log.debug(shapes.length+"");
			for (var i:int = 0; i < shapes.length; i++) 
			{
				var element:b2Shape = shapes[i] as b2Shape;
				var fixtureDef:b2FixtureDef = mappedOrDefaultFixtureDef(source);
				fixtureDef.shape = element;
				body.CreateFixture(fixtureDef);	
			}
		}
		
		
		
		override public function set initialized(value:Boolean):void
		{
			super.initialized = value;
			if (autoStartPhysicsEngine)
			{
				initPhysicsEngine();
			}
		}
		
		public function initPhysicsEngine():void
		{
			
			log.debug("initPhysicsEngine");
			_worldClock.register(this);
			createBodies();
		}
		 
		
		protected function createBodies():void
		{
			log.debug("createBodies");
			bodies = new Dictionary();
			var elementCount:int = numElements;
			for (var i:int = 0; i < elementCount; i++) {
				var element:UIComponent = getElementAt(i) as UIComponent;
				if (element && element.name!="SkinablePhysicsContainer_debug"){
					var body:b2Body = createBody(element);
					bodies[element] = body;
				}
			}
		}
		
		public function getComponentBody(element:UIComponent):b2Body 
		{
			return bodies[element];	
		}
		
		override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
		{
			
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			
			if (_setBoundriesChanged==true)
			{
				_setBoundriesChanged = false;
				setupBoundries();
			}
			
			if (_debugChanged){
				_debugChanged=false;
				debugContainer.visible = debug;
			}
			
			if (_debugInFrontChanged){
				_debugInFrontChanged=false;
				var debugLayerPosition:int = _debugInFront ? this.numElements-1 : 0;
				this.setElementIndex(debugContainer,debugLayerPosition);
			}
		}
		
		 
		
		override protected function commitProperties():void
		{
			
			
			if (_xGravityChanged || _yGravityChanged && world!=null)
			{
				_xGravityChanged = _yGravityChanged = false;
				world.GetGravity().Set(xGravity,yGravity);
			}
			
			super.commitProperties();
		}
		
		public function step():void 
		{
			world.Step(_worldClock.timeStep,_worldDef.velocityIterations,_worldDef.positionIterations);
			
			for each(var body:b2Body in bodies){
				var actualElement:UIComponent = body.GetUserData();
				actualElement.x = _worldDef.pixel( body.GetPosition().x );
				actualElement.y = _worldDef.pixel( body.GetPosition().y);
				actualElement.rotation = body.GetAngle() * (180/Math.PI);
			}
			if (_debug){
				world.DrawDebugData();
			}
		}
		
		protected function setupDebug():void 
		{
			debugContainer.name="SkinablePhysicsContainer_debug";
			var sprite:Sprite = new MovieClip();
			debugContainer.addChild(sprite);
			
			this.addElement(debugContainer);
			this.setElementIndex(debugContainer,0);
			
			var debugDraw:b2DebugDraw = new b2DebugDraw();
			debugDraw.SetSprite(sprite);
			debugDraw.SetDrawScale(_worldDef.scale);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1); // PIXELS
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit );//| b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit
			world.SetDebugDraw(debugDraw);

		}
        
		override protected function measure():void
		{
			log.debug("-meaure()");
			super.measure();
			if (_setBoundries){
				_setBoundriesChanged
				invalidateDisplayList();
			}
		}	
		
		private function createBody(actualTarget:UIComponent):b2Body
        {
			
			log.debug("createBody " +actualTarget);
			var bodyDef:b2BodyDef = new b2BodyDef();
			actualTarget.addEventListener(ResizeEvent.RESIZE,onUIComponentResize);
			
			var w:Number = actualTarget.getExplicitOrMeasuredWidth();
			var h:Number = actualTarget.getExplicitOrMeasuredHeight();
			var meter:MeterDimensions = _worldDef.meterDimentions(w,h,actualTarget.x,actualTarget.y);
			bodyDef.type =  (componentMappings[actualTarget]!=null) ? componentMappings[actualTarget].bodyType : b2Body.b2_dynamicBody;
			bodyDef.position.Set(meter.x,meter.y);
			var body:b2Body = world.CreateBody(bodyDef);
			
			var shapes:Array = mappedOrDefaultShape(actualTarget,meter);
			for (var i:int = 0; i < shapes.length; i++) 
			{
				var element:b2Shape = shapes[i] as b2Shape;
				var fixtureDef:b2FixtureDef = mappedOrDefaultFixtureDef(actualTarget);
				fixtureDef.shape = element; 
				
				body.SetUserData(actualTarget)
				body.CreateFixture(fixtureDef);	
			}
			return body;
        }
		
		
        
		protected function mappedOrDefaultFixtureDef(element:UIComponent): b2FixtureDef
		{
			var fixture: b2FixtureDef = (componentMappings[element] && componentMappings[element].fixtureDef) ? componentMappings[element].fixtureDef : null;
			if (fixture==null)
			{
				fixture =  new b2FixtureDef();	
				fixture.density = _worldDef.fixtureDensity;
				fixture.friction = _worldDef.fixtureFriction;
				fixture.restitution = _worldDef.fixtureRestitution;
			}
			return fixture;
		}
		
		protected function mappedOrDefaultShape(element:*,meter:MeterDimensions): Array
		{
			var shapes:Array = tryParseCompositeVisualElement(element,meter);
			var mappedShapes: Array = (componentMappings[element] && componentMappings[element].shapes) ? componentMappings[element].shapes :null;
			
			if (!mappedShapes)
			{
				if (shapes.length==0){
					var shape:b2PolygonShape = new b2PolygonShape();
					var rotation:Number = element.hasOwnProperty("rotation") ? element.rotation :0;
					shape.SetAsOrientedBox(meter.width/2, meter.height/2, new b2Vec2(meter.width/2, meter.height/2),worldDef.radians(rotation));
					shapes.push(shape);
				}
			} 
			else
			{
				for (var i:int = 0; i < shapes.length; i++) 
				{
					var shapex:b2Shape = shapes[i] as b2Shape;
					switch(shapex.GetType())
					{
						case b2Shape.e_circleShape:
							var circle:b2CircleShape = shapex as b2CircleShape;
							circle.SetRadius(_worldDef.meter(circle.GetRadius()));
							circle.SetLocalPosition(new b2Vec2(meter.width/2,meter.height/2));
							break;
						case b2Shape.e_polygonShape:
							var poly:b2PolygonShape = shapex as b2PolygonShape;
							for (var j:int = 0; j < poly.GetVertexCount(); j++) 
							{
								var vertex:b2Vec2 = poly.GetVertices()[i] as b2Vec2;
								vertex.x = vertex.x/2 + meter.width/2;
								vertex.y = vertex.y/2 +  meter.height/2
							}
							break;
					}
				}
			}
			
			return shapes;
		}
		
		
		public static const MAX_POINTS:uint=10000;//Failsafe
		protected function getEdgePointsFromBitmapData(bmd:BitmapData):Vector.<Point>{
			var first_non_trans:Point=BitmapDataUtil.getFirstNonTransparentPixel(bmd);
			var points:Vector.<Point>=new Vector.<Point>();
			if(first_non_trans==null)return points;
			var scanner:BitmapEdgeScanner=new BitmapEdgeScanner(bmd);
			scanner.moveTo(first_non_trans);
			points[0]=first_non_trans;
			var next:Point;
			//in the event of a bug (an error, infinite loop) in BitEdgeScanner, which is not perfect,
			//this loop stops at MAX_POINTS. Increase this number if working with big bitmapdatas. 
			for(var i:uint=0;i<MAX_POINTS;i++){
				next=scanner.getNextEdgePoint();
				if(next.equals(first_non_trans))break;
				points.push(next);
				scanner.moveTo(next);
			}
			//if(i>=MAX_POINTS)mx.controls.Alert.show("Error : shape scan has more than MAX_POINTS ("+MAX_POINTS+")");
			return points;
		}
		
		public static function VectorToArray( v:Object ):Array
		{
			var vec : Vector.<Object> = Vector.<Object>(v);
			var arr : Array = new Array()
			for each( var i : Object in vec ) {
				arr.push(i);
			}
			return arr;
		}
		
		protected function tryParseCompositeVisualElement(element:*,meter:MeterDimensions):Array
		{
			var b2dshapes:Array = [];
			var mappedAsCompositeElement:Boolean = (compisiteVisualElements[element]!=null);
			if (mappedAsCompositeElement){
				var shapeParser:ComplexShapeParser = compisiteVisualElements[element];
				b2dshapes = shapeParser.parse (element,this,worldDef);
			}
			return b2dshapes;
		}
		
		private var _setBoundriesChanged:Boolean = false;
		private var _setBoundries:Boolean = false;
		public function get setBoundries():Boolean
		{
			return _setBoundries;
		}
		public function set setBoundries(value:Boolean):void
		{
			if (value==_setBoundries)
				return;
			_setBoundries = value;
			
			_setBoundriesChanged = true;
			invalidateDisplayList();
		}
		
		private function initializeWorld():void
        {
            log.debug("initializeWorld");
            var doSleep:Boolean = true;
			var gravity:b2Vec2 = new b2Vec2(xGravity,yGravity);
            this._world = new b2World(gravity, doSleep);
			if (worldDef==null)
				worldDef = WorldDefinition.globalDefinition;
			if (worldClock==null)
				worldClock =WorldClock.globalClock;
			
        }
		
		private var _world:b2World = null;
        public function get world():b2World
        {
            return _world;
        }
       
		protected function setupBoundries():void
        {
			//return;
			clearBoundries();
			if (_setBoundries==false)
				return;
			
			// Create border of boxes
			var wall:b2PolygonShape= new b2PolygonShape();
			var wallBd:b2BodyDef = new b2BodyDef();
			var wallB:b2Body;
			
			var w:Number = this.getExplicitOrMeasuredWidth();
			var h:Number = this.getExplicitOrMeasuredHeight();
			
			// Left
			wall.SetAsOrientedBox(worldDef.meter(BOUNDRY_WEIGHT),worldDef.meter(h/2),new b2Vec2(worldDef.meter(BOUNDRY_WEIGHT),worldDef.meter(h/2)));
			wallBd.position.Set(0,0);
			
			wallB = world.CreateBody(wallBd);
			boundries.push(wallB);
			wallB.CreateFixture2(wall);
			// Right
			wallBd.position.Set(worldDef.meter(w-BOUNDRY_WEIGHT) , 0  );
			wallB = world.CreateBody(wallBd);
			boundries.push(wallB);
			wallB.CreateFixture2(wall);
			// Top
			wall.SetAsOrientedBox(worldDef.meter(w/2),worldDef.meter(BOUNDRY_WEIGHT),new b2Vec2(worldDef.meter(w/2),worldDef.meter(BOUNDRY_WEIGHT)));
			
			wallBd.position.Set(0 , 0);
			wallB = world.CreateBody(wallBd);
			boundries.push(wallB);
			wallB.CreateFixture2(wall);
			// Bottom
			wallBd.position.Set(0 , worldDef.meter(h) );
			wallB = world.CreateBody(wallBd);
			boundries.push(wallB);
			wallB.CreateFixture2(wall);
			
			return;
        }
		
		protected function clearBoundries():void {
			for each (var body:b2Body in boundries){
				world.DestroyBody(body);
			}
			boundries = [];
		}
		
		protected var _xGravity:Number;
		protected var _xGravityChanged:Boolean;
		public function get xGravity():Number
		{
			return _xGravity;
		}
		
		public function set xGravity(value:Number):void
		{
			if (value ==_xGravity)
				return;
			_xGravity = value;
			_xGravityChanged=true;
			invalidateProperties();
		}
		
		protected var _yGravity:Number;
		protected var _yGravityChanged:Boolean;
		public function get yGravity():Number
		{
			return _yGravity;
		}
		
		public function set yGravity(value:Number):void
		{
			if (value ==_yGravity)
				return;
			_yGravity = value;
			_yGravityChanged=true;
			invalidateProperties();
		}
		
		protected var _debug:Boolean;
		protected var _debugChanged:Boolean;
		public function get debug():Boolean
		{
			return _debug;
		}
		
		public function set debug(value:Boolean):void
		{
			if (value ==_debug)
				return;
			_debug = value;
			_debugChanged=true;
			invalidateDisplayList();
		}

		protected var _debugInFront:Boolean;
		protected var _debugInFrontChanged:Boolean;
		public function get debugInFront():Boolean
		{
			return _debugInFront;
		}
		
		public function set debugInFront(value:Boolean):void
		{
			if (value ==_debugInFront)
				return;
			_debugInFront = value;
			_debugInFrontChanged=true;
			invalidateDisplayList();
		}
		
		protected var _autoStartPhysicsEngine:Boolean = true;
		public function get autoStartPhysicsEngine():Boolean
		{
			return _autoStartPhysicsEngine;
		}
		
		public function set autoStartPhysicsEngine(value:Boolean):void
		{
			if (value ==_autoStartPhysicsEngine)
				return;
			_autoStartPhysicsEngine = value;
		}
		
		protected var _worldDef:WorldDefinition;
		public function get worldDef():WorldDefinition
		{
			return _worldDef;
		}
		
		public function set worldDef(value:WorldDefinition):void
		{
			if (value ==_worldDef || _worldDef!=null)
				return;
			_worldDef = value;
		}
		
		protected var _worldClock:WorldClock;
		public function get worldClock():WorldClock
		{
			return _worldClock;
		}
		
		public function set worldClock(value:WorldClock):void
		{
			if (value ==_worldClock || _worldClock!=null)
				return;
			_worldClock = value;
		}
		

	}
}
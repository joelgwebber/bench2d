package Box2D.utilities
{
	import Box2D.flex.b2d.IPhysicsContainer;
	
	import flash.events.TimerEvent;
	import flash.utils.Timer;

	public class WorldClock
	{
		public static const TIME_STEP:Number = 1/30;
		
		private static var _globalClock:WorldClock;
		public static function get globalClock():WorldClock
		{
			if (_globalClock==null)
				_globalClock = new WorldClock();
			return _globalClock;
		}
		
		private var _timeStep:Number;
		public function get timeStep():Number
		{
			return _timeStep;
		}
		
		private var worlds:Vector.<IPhysicsContainer>;
		
		public function WorldClock(timeStep:Number=TIME_STEP)
		{
			worlds = new Vector.<IPhysicsContainer>();
			this._timeStep = timeStep;
			start();
		}
		
		private var updateCycle:Timer;
		protected function start():void 
		{
			if (updateCycle!=null){
				updateCycle.start();
				return ;	
			}
			
			updateCycle = new Timer(this._timeStep*1000,0);
			updateCycle.addEventListener(TimerEvent.TIMER,onUpdateCycleTick);
			updateCycle.start();
			
		}

		private function onUpdateCycleTick(event:TimerEvent):void
		{
			updateRegisteredWorlds();
		}
		
		protected function updateRegisteredWorlds():void {
			for (var i:int = 0; i < worlds.length; i++) {
				var container:IPhysicsContainer = worlds[i];
				container.step();
			}
		}
		
		public function register(container:IPhysicsContainer):void
		{
			var exists:Boolean = (worlds.indexOf(container)!=-1);
			if (exists)
				return;
			
			worlds.push(container);			
		}
		
		public function unRegister(container:IPhysicsContainer):void
		{
			var exists:Boolean = (worlds.indexOf(container)!=-1);
			if (!exists)
				return;
			var pos:int =  worlds.indexOf(container);
			worlds.splice(pos,1);
		}
	}
}
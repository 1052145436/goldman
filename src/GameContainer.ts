module goldman {
	/**
	 * 主游戏容器
	 */
	export class GameContainer extends egret.Sprite {
		/**游戏区域宽*/
		static thisW:number;
		/**游戏区域高*/
		static thisH:number;

		private hookManager:HookManager;
		private objManager:ObjManager;

		public constructor() {
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		}

		/**初始化*/
		private onAddToStage(e:egret.Event):void {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			GameContainer.thisW = this.stage.stageWidth;
			GameContainer.thisH = this.stage.stageHeight;
			this.createGameScene();
		}

		/**创建游戏场景*/
		private createGameScene():void {
			this.objManager = new ObjManager();
			this.objManager.addEventListener(ObjManager.OBJ_MANAGER_EVENT, this.onObjManagerEventHandler, this);
			this.addChild(this.objManager);
			this.objManager.createObjs();
			this.hookManager = new HookManager();
			this.hookManager.addEventListener(HookManager.HOOK_MANAGER_EVENT, this.onHookManagerEventHandler, this);
			this.addChild(this.hookManager);
			this.hookManager.x = GameContainer.thisW / 2;
			this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickStage, this);
			this.addEventListener(egret.Event.ENTER_FRAME, this.onGameEnterFrame, this);
		}

		private onGameEnterFrame(e:Event):void {
			this.hookManager.onUpdateEnterFrame();
		}

		private onObjManagerEventHandler(e:egret.Event):void {
			var data:any = (e.data);
			switch (data.type) {
			}
		}

		private onHookManagerEventHandler(e:egret.Event):void {
			var data:any = (e.data);
			switch (data.type) {
				case HookManager.GO_COMPLETE_EVENT:
					this.onHookGoComplete();
					break;
				case HookManager.UPDATE_HOOK_POSITION_EVENT:
					if (this.hookManager.isBack && this.objManager.catchObj) {
						this.updateCatchObjPosition(data.hook, data.hookGrabBmp);
					} else if (!this.hookManager.isBack) {
						this.checkHookHitObject(data.hookBmp);
					}
					break;
			}
		}

		private onHookGoComplete():void {
			if (this.objManager.catchObj) {
				var catchObj = this.objManager.removeObj(this.objManager.catchObj);
				//todo 获取当前价格
				catchObj.destory();
			}
		}

		private updateCatchObjPosition(hook:egret.Sprite, hookGrabBmp:egret.Bitmap):void {
			var p:egret.Point = hook.localToGlobal(hookGrabBmp.x - this.objManager.catchObj.width / 2 + hookGrabBmp.width / 2, hookGrabBmp.y + hookGrabBmp.height * 0.45);
			var gloablP:egret.Point = this.globalToLocal(p.x, p.y);
			this.objManager.setCatchObjPosition(gloablP, hook.rotation)
		}

		private checkHookHitObject(hookBmp:egret.Bitmap):void {
			var goldsArr:Obj[] = this.objManager.objsArr;
			var me = this;
			for (var i in goldsArr) {
				var obj:Obj = goldsArr[i];
				var isHit:boolean = GameUtil.hitTestObjByParentObj(hookBmp, obj, this);//检测钩子和物体是否相撞
				if (isHit) {
					me.objManager.setCatchObject(obj);
					if(obj.type == "TNT") {
						me.hookManager.hitObject(0);
						me.objManager.removeObjsAtAreaByHitObj(obj);
						obj.overObject();
						setTimeout(function() {
							obj.backObject();
							me.hookManager.hitObject(obj.backV);
						}, 300);
					} else {
						me.hookManager.hitObject(obj.backV);
					}
					break;
				}
			}
		}

		private clickStage(e:egret.TouchEvent):void {
			this.hookManager.startGo();
		}
	}
}
module goldman {
    /**
     * ����Ϸ����
     */
    export class GameContainer extends egret.DisplayObjectContainer {
        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        /**��ʼ��*/
        private onAddToStage(event:egret.Event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        }

        /**������Ϸ����*/
        private createGameScene():void {
            console.log("start");
        }
    }
}
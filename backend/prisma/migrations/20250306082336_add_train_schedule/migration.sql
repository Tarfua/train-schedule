-- CreateTable
CREATE TABLE "train_schedules" (
    "id" TEXT NOT NULL,
    "trainNumber" TEXT NOT NULL,
    "departureStationId" TEXT NOT NULL,
    "arrivalStationId" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "departurePlatform" INTEGER,
    "arrivalPlatform" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "train_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "train_schedules" ADD CONSTRAINT "train_schedules_departureStationId_fkey" FOREIGN KEY ("departureStationId") REFERENCES "stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "train_schedules" ADD CONSTRAINT "train_schedules_arrivalStationId_fkey" FOREIGN KEY ("arrivalStationId") REFERENCES "stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

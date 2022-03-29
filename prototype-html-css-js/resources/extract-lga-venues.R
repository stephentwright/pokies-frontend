library(readxl)
library(stringr)
library(tidyverse)

# read in the xlxs file;
filePath <- 'D:/Repositories/pokies-watch/prototype-html-css-js/resources/premises/'
fileName <- 'premises-list-mar-2022.xlsx'
sheetName <- 'Premises List'
rawVenues <- read_xlsx(path=paste(filePath,fileName,sep=''), sheet=sheetName, skip=3)

# attached the LGA code
load(file=paste(filePath,'lgaNSW.dat',sep=''))
lgaNSW$lgaNameClean <- str_remove_all(lgaNSW$lgaNamesNSW,pattern="( \\s*\\([^\\)]+\\))")
lgaNSW <- lgaNSW %>% select(-lgaNamesNSW)

# clean and merge -- pass 1
rawVenues$lgaNameClean <- str_remove(rawVenues$LGA,'( City Council)|( Shire Council)| Council')

rawVenuesLGA <- left_join(rawVenues,lgaNSW, by="lgaNameClean")

needToClean <- rawVenuesLGA %>% filter(is.na(lgaIDsNSW)) %>% group_by(LGA,lgaNameClean) %>% summarise(n=n())
write.csv(needToClean[,2],file=paste(filePath,'cleanMe.csv',sep=''))
cleanedLGAs <- read.csv(file=paste(filePath,'cleanLGA.csv',sep=''))

# clean and merge -- pass 2
lgaNSW <- rbind(lgaNSW,cleanedLGAs)
rawVenuesLGA <- left_join(rawVenues,lgaNSW, by="lgaNameClean")
needToClean <- rawVenuesLGA %>% filter(is.na(lgaIDsNSW)) %>% group_by(LGA,lgaNameClean) %>% summarise(n=n())
## only 162 record not merged with an LGA code;




